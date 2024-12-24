import React, { useState, useEffect } from 'react';
import { DatePicker, Table, Button, Checkbox } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';

const TimeSheetForm = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [weeks, setWeeks] = useState([]);
    const [existingTimeSheets, setExistingTimeSheets] = useState({});

    // Récupération des informations de l'employé
    useEffect(() => {
        const employee = JSON.parse(localStorage.getItem('user'));
        if (employee) {
            setEmployeeName(employee.name);
            setEmployeeId(employee.id);
        }
    }, []);

    // Charger les feuilles de temps existantes
    const loadTimeSheets = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/time-sheets?employeeId=${employeeId}&month=${selectedMonth.format('YYYY-MM')}`);
            console.log(response);
            const timeSheetsMap = response.data.reduce((acc, timeSheet) => {
                acc[timeSheet.date] = timeSheet;
                return acc;
            }, {});
            setExistingTimeSheets(timeSheetsMap);
            updateWeeksWithExistingData(timeSheetsMap); // Mettre à jour les semaines avec les données existantes
        } catch (error) {
            console.error('Erreur lors du chargement des feuilles de temps :', error);
        }
    };

    // Mettre à jour les semaines avec les données des feuilles de temps existantes
    const updateWeeksWithExistingData = (timeSheetsMap) => {
        const updatedWeeks = weeks.map(week =>
            week.map(day => {
                const timeSheet = timeSheetsMap[day.date];
                if (timeSheet) {
                    return {
                        ...day,
                        sessions: [
                            timeSheet.session1,
                            timeSheet.session2,
                            timeSheet.session3,
                            timeSheet.session4,
                        ],
                    };
                }
                return day;
            })
        );
        setWeeks(updatedWeeks);
    };

    // Charger les feuilles de temps au changement de mois ou d'employé
    useEffect(() => {
        if (employeeId) {
            loadTimeSheets();
        }
    }, [employeeId, selectedMonth]);

    // Génération des semaines du mois
    const generateWeeks = (month) => {
        const startOfMonth = dayjs(month).startOf('month');
        const endOfMonth = dayjs(month).endOf('month');
        const weeks = [];

        let currentWeekStart = startOfMonth.startOf('week');
        while (currentWeekStart.isBefore(endOfMonth)) {
            const week = Array.from({ length: 7 }, (_, i) => {
                const currentDate = currentWeekStart.add(i, 'day');
                return currentDate.isSame(month, 'month')
                    ? { date: currentDate.toISOString(), sessions: [false, false, false, false] }
                    : null;
            }).filter((date) => date);

            weeks.push(week);
            currentWeekStart = currentWeekStart.add(7, 'day');
        }

        setWeeks(weeks);
    };

    useEffect(() => {
        generateWeeks(selectedMonth);
    }, [selectedMonth]);

    // Gestion des changements dans les cases à cocher
    const handleCheckboxChange = (dayIndex, sessionIndex) => {
        const updatedWeeks = [...weeks];
        const weekIndex = Math.floor(dayIndex / 7);
        const dayInWeekIndex = dayIndex % 7;

        updatedWeeks[weekIndex][dayInWeekIndex].sessions[sessionIndex] =
            !updatedWeeks[weekIndex][dayInWeekIndex].sessions[sessionIndex];

        setWeeks(updatedWeeks);
    };

    // Soumission des données pour une seule date
    const handleSaveOrUpdate = async (day) => {
        const timeSheet = {
            employeeId,
            employeeName,
            date: day.date,
            session1: day.sessions[0],
            session2: day.sessions[1],
            session3: day.sessions[2],
            session4: day.sessions[3],
        };

        try {
            if (existingTimeSheets[day.date]) {
                await axios.put(`http://localhost:3001/time-sheets/update/${existingTimeSheets[day.date]._id}`, {
                    session1: day.sessions[0],
                    session2: day.sessions[1],
                    session3: day.sessions[2],
                    session4: day.sessions[3],
                });
            } else {
                await axios.post('http://localhost:3001/time-sheets/create', timeSheet);
            }
            loadTimeSheets(); // Recharger les données après chaque opération
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement/mise à jour de la feuille de temps :', error);
        }
    };

    // Colonnes du tableau
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('DD/MM/YYYY'),
        },
        ...Array.from({ length: 4 }).map((_, sessionIndex) => ({
            title: `Session ${sessionIndex + 1}`,
            key: `session${sessionIndex + 1}`,
            render: (_, record, dayIndex) => (
                <Checkbox
                    checked={record.sessions[sessionIndex]}
                    onChange={() => handleCheckboxChange(dayIndex, sessionIndex)}
                />
            ),
        })),
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleSaveOrUpdate(record)}>
                    {existingTimeSheets[record.date] ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
            ),
        },
    ];

    const data = weeks.flat().map((day, index) => ({
        key: index,
        date: day.date,
        sessions: day.sessions,
    }));

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-700">{`Feuille de temps de ${employeeName}`}</h1>
            <div className="flex items-center space-x-4">
                <label className="text-lg font-medium">Sélectionnez un mois :</label>
                <DatePicker
                    picker="month"
                    value={selectedMonth}
                    onChange={(date) => setSelectedMonth(dayjs(date))}
                    className="w-60"
                />
            </div>
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                bordered
                className="shadow-md"
            />
        </div>
    );
};

export default TimeSheetForm;
