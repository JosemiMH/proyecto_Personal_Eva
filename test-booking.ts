
// Using global fetch

async function testBooking() {
    try {
        // 1. Check available slots
        console.log('Checking available slots...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        // Ensure it's a weekday
        if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1); // Sunday -> Monday
        if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2); // Saturday -> Monday

        const dateStr = tomorrow.toISOString();
        const availableRes = await fetch(`http://localhost:5000/api/appointments/available?date=${dateStr}`);
        const availableData = await availableRes.json();

        console.log('Available slots response:', JSON.stringify(availableData, null, 2));

        if (!availableData.success || !availableData.data || availableData.data.length === 0) {
            console.error('No slots available or error fetching slots');
            return;
        }

        const slot = availableData.data[0];
        console.log('Selected slot:', slot);

        // 2. Create appointment
        console.log('Creating appointment...');
        const appointmentData = {
            name: "Test User API",
            email: "test.api@example.com",
            phone: "123456789",
            company: "Test Corp",
            service: "consultoria",
            message: "This is an API test appointment",
            privacy: true,
            date: slot.start,
            duration: 60,
            status: "pending"
        };

        const createRes = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });

        const createData = await createRes.json();
        console.log('Create appointment response:', JSON.stringify(createData, null, 2));

        if (createData.success) {
            console.log('SUCCESS: Appointment created successfully!');
        } else {
            console.error('FAILURE: Failed to create appointment');
        }

    } catch (error) {
        console.error('Error running test:', error);
    }
}

testBooking();
