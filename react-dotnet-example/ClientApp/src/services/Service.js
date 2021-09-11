/*import axios from 'axios'; */

export async function submitUser(user) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
    var result = await response;
    if (result.ok) {
        return true;
    } else {
        return false;
    }
}

export async function registerNewUser(user) {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
    var result = await response;

    if (result.ok) {
        return true;
    } else {
        return false;
    }
}

export async function updateUser(users) {
    const response = await fetch('/api/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
    })
    var result = await response;

    if (result.ok) {
        return true;
    } else {
        return false;
    }
}


// ===========================================================

export async function getOrgaData() {
    const response = await fetch('/api/getData');
    return await response.json();
}

export async function getInjectionUnitNames(ETSCode) {
    try {
        const response = await fetch('/api/getInjectionUnitNames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ETSCode)
        })
        return await response.json();
    } catch (err) {
        console.log(ETSCode);
    }
}

export async function getDppData(dppParams) {
    const response = await fetch('/api/getDppDataService', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dppParams)
    })
    return await response.json();
}

export async function getAicData(aicParams) {
    const response = await fetch('/api/getAicDataService', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aicParams)
    })
    return await response.json();
}

// =========================================================== Database Operations 

export async function getDataDB(params) {
    const response = await fetch('/api/getDataDB', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    })
    return await response.json();
}



export async function saveSmallData(data) {
    const response = await fetch('/api/saveSmallData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return await response;
}


// =========================================================== Order Page

export async function saveOrgaSantralToDB() {
    await fetch('/api/loadSantarlsToDB', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
}


export async function getOrgaSantral() {
    const response = await fetch('/api/getOrgaSantral');
    return await response.json(); 

}

export async function saveOrder(data) {
    const response = await fetch('/api/saveOrders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return await response;
}

// =========================================================== File 

export async function uploadCentralData(fileData) {
/*    const response = await axios.post('/api/uploadFile', fileData);
    return await response;
*/

    const response = await fetch('/api/uploadFile', {
        method: 'POST',
        body: fileData
    })
    return await response;

}

// =========================================================== get orders 

export async function getOrders() {
    const response = await fetch('/api/getOrders', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}

// =========================================================== Get Excel Files 

export async function getExcelFilesFromDB(santralETSO) {
    const response = await fetch('/api/getExcelFiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(santralETSO)
    });
    return await response.json();
}