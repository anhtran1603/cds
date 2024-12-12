var API_URL= process.env.NEXT_PUBLIC_API_URL;

export async function Login(username: string, password: string) {
    const res = await fetch(API_URL + `/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ userName: username, password: password }),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getUsers() {
    const res = await fetch(API_URL + `/auth`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}
export async function addUser(data: any) {
    const res = await fetch(API_URL + `/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function updateUser(id: string, data: any) {
    const res = await fetch(API_URL + `/auth/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });
    return res.json();
}

export async function deleteUser(id: string) {
    const res = await fetch(API_URL + `/auth/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getCompanies() {
    const res = await fetch(API_URL + `/company`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getCompany(id) {
    const res = await fetch(API_URL + `/company/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function addCompany(data: any) {
    const res = await fetch(API_URL + `/company`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function updateCompany(id: string, data: any) {
    const res = await fetch(API_URL + `/company/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });
    return res.json();
}

export async function deleteCompany(id: string) {
    const res = await fetch(API_URL + `/company/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getApplications() {

    const res = await fetch(API_URL + `/application`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getApplication(id: string) {
    console.log(API_URL + `/application/${id}`);
    const res = await fetch(API_URL + `/application/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function addApplication(data: any) {
    const res = await fetch(API_URL + `/application`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function updateApplication(id: string, data: any) {
    const res = await fetch(API_URL + `/application/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }
    console.log(res);
    return res;
}

export async function deleteApplication(id: string) {
    const res = await fetch(API_URL + `/application/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res;
}

export async function addEmployee(data: any) {
    const res = await fetch(API_URL + `/employee`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getEmployees() {
    const res = await fetch(API_URL + `/employee`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getAllEmployees() {
    const res = await fetch(API_URL + `/employee/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}
export async function getEmployee(id) {
    const res = await fetch(API_URL + `/employee/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function updateEmployee(id: string, data: any) {
    const res = await fetch(API_URL + `/employee/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res;
}

export async function deleteEmployee(id: string) {
    const res = await fetch(API_URL + `/employee/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res;
}

export async function getLicenses() {
    const res = await fetch(API_URL + `/license`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}
export async function getLicensesCompleted() {
    const res = await fetch(API_URL + `/license/completed`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getLicense(id: string) {
    const res = await fetch(API_URL + `/license/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function addLicense(data: any) {
    const res = await fetch(API_URL + `/license`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}


export async function updateLicense(id: string, data: any) {
    const res = await fetch(API_URL + `/license/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data),
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res;
}


export async function deleteLicense(id: string) {
    const res = await fetch(API_URL + `/license/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
}

export async function getUserByRole(roleId: number) {
    const res = await fetch(API_URL + `/auth/role/${roleId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }

    return res.json();
    
}
export async function checkDuplicateCitizenID(citizenID: string) {
    const res = await fetch(API_URL + `/employee/check-duplicate/${citizenID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        next: { revalidate: 3600 }
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch data');
    }
    const data = await res.json();
 return data;
}
