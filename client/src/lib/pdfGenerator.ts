import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePdf = (type: 'kpi' | 'checklist' | 'training', language: 'es' | 'en') => {
    const doc = new jsPDF();

    const titleColor = '#2c3e50';
    const accentColor = '#3498db';

    if (type === 'kpi') {
        // Title
        doc.setFontSize(20);
        doc.setTextColor(titleColor);
        doc.text(language === 'es' ? 'Guía de KPIs Esenciales' : 'Essential KPIs Guide', 20, 20);

        doc.setFontSize(12);
        doc.setTextColor('#777777');
        doc.text('Eva Pérez | Spa Manager & Wellness Consultant', 20, 30);

        // Content
        let y = 50;

        const kpis = [
            {
                title: language === 'es' ? '1. RevPATH (Ingresos por Hora Disponible)' : '1. RevPATH (Revenue Per Available Treatment Hour)',
                desc: language === 'es' ? 'Mide la eficiencia de ingresos vs capacidad.' : 'Measures revenue efficiency vs capacity.',
                formula: language === 'es' ? 'Ingresos / (Cabinas * Horas)' : 'Revenue / (Rooms * Hours)'
            },
            {
                title: language === 'es' ? '2. Ocupación de Cabinas' : '2. Treatment Room Occupancy',
                desc: language === 'es' ? '% tiempo ocupado con tratamientos.' : '% time occupied with treatments.',
                formula: language === 'es' ? '(Horas Vendidas / Horas Totales) * 100' : '(Sold Hours / Total Hours) * 100'
            },
            {
                title: language === 'es' ? '3. Ticket Medio' : '3. Average Ticket',
                desc: language === 'es' ? 'Gasto promedio por visita.' : 'Average spend per visit.',
                formula: language === 'es' ? 'Ingresos / Nº Tickets' : 'Revenue / # Tickets'
            }
        ];

        kpis.forEach(kpi => {
            doc.setFontSize(14);
            doc.setTextColor(accentColor);
            doc.text(kpi.title, 20, y);
            y += 10;

            doc.setFontSize(11);
            doc.setTextColor('#333333');
            doc.text(kpi.desc, 20, y);
            y += 7;

            doc.setFont("courier", "normal");
            doc.setFillColor('#f0f0f0');
            doc.rect(20, y - 5, 170, 10, 'F');
            doc.text(kpi.formula, 22, y + 2);
            doc.setFont("helvetica", "normal");

            y += 20;
        });

    } else if (type === 'checklist') {
        doc.setFontSize(20);
        doc.setTextColor('#27ae60');
        doc.text(language === 'es' ? 'Checklist: Experiencia Spa' : 'Checklist: Spa Experience', 20, 20);

        const sections = [
            {
                title: language === 'es' ? 'I. Reserva y Recepción' : 'I. Reservation & Reception',
                items: language === 'es'
                    ? ['Teléfono respondido antes del 3er tono', 'Bienvenida cálida con nombre', 'Check-in rápido']
                    : ['Phone answered before 3rd ring', 'Warm welcome using name', 'Fast check-in']
            },
            {
                title: language === 'es' ? 'II. Instalaciones' : 'II. Facilities',
                items: language === 'es'
                    ? ['Temperatura confortable (24-26°C)', 'Música relajante y volumen uniforme', 'Limpieza impecable']
                    : ['Comfortable temperature (24-26°C)', 'Relaxing music, uniform volume', 'Impeccable cleanliness']
            },
            {
                title: language === 'es' ? 'III. Tratamiento' : 'III. Treatment',
                items: language === 'es'
                    ? ['Terapeuta se presenta por nombre', 'Consulta previa realizada', 'Privacidad respetada']
                    : ['Therapist introduces by name', 'Consultation performed', 'Privacy respected']
            }
        ];

        let y = 40;

        sections.forEach(section => {
            doc.setFontSize(14);
            doc.setTextColor('#2c3e50');
            doc.text(section.title, 20, y);
            y += 10;

            doc.setFontSize(11);
            doc.setTextColor('#333333');
            section.items.forEach(item => {
                doc.rect(20, y - 4, 4, 4); // Checkbox
                doc.text(item, 30, y);
                y += 8;
            });
            y += 10;
        });

    } else if (type === 'training') {
        doc.setFontSize(20);
        doc.setTextColor('#8e44ad');
        doc.text(language === 'es' ? 'Plan de Formación' : 'Training Plan', 20, 20);

        const headers = language === 'es'
            ? [['Módulo', 'Objetivo', 'Frecuencia']]
            : [['Module', 'Objective', 'Frequency']];

        const data = language === 'es'
            ? [
                ['Protocolos', 'Estandarizar servicios', 'Trimestral'],
                ['Producto', 'Conocimiento ingredientes', 'Mensual'],
                ['Ventas', 'Up-selling / Cross-selling', 'Trimestral'],
                ['Atención', 'Etiqueta y protocolo', 'Semestral']
            ]
            : [
                ['Protocols', 'Standardize services', 'Quarterly'],
                ['Product', 'Ingredient knowledge', 'Monthly'],
                ['Sales', 'Up-selling / Cross-selling', 'Quarterly'],
                ['Service', 'Etiquette and protocol', 'Biannual']
            ];

        autoTable(doc, {
            head: headers,
            body: data,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: '#8e44ad' }
        });
    }

    doc.save(`eva-perez-${type}.pdf`);
};
