const login = async () => {
    try {
        console.log('Attempting login...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'adminpassword123'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        if (response.ok) {
            console.log('Login Successful!');
            console.log('Token:', data.token);
            console.log('User Role:', data.user.role);
        } else {
            console.log('Login Failed!');
            console.log('Message:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

login();
