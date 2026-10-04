// ===============================
// JWT TOKEN
// ===============================

const token = localStorage.getItem("token");


// If user is not logged in
if (!token) {
    window.location.href = "/index.html";
}


// ===============================
// LOAD STUDENTS
// ===============================

async function loadStudents() {

    const table = document.getElementById("studentTable");

    try {

        const response = await fetch("/students", {

            method: "GET",

            headers: {
                "Authorization": "Bearer " + token
            }

        });

        if (response.status === 401 || response.status === 403) {

            localStorage.removeItem("token");

            window.location.href = "/index.html";

            return;
        }

        if (!response.ok) {

            throw new Error("Failed to load students");
        }

        const students = await response.json();

        displayStudents(students);

    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    Failed to load students
                </td>
            </tr>
        `;
    }
}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(students) {

    const table = document.getElementById("studentTable");

    const totalStudents = document.getElementById("totalStudents");

    const heroStudentCount =
        document.getElementById("heroStudentCount");


    totalStudents.textContent = students.length;

    heroStudentCount.textContent = students.length;


    table.innerHTML = "";


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    No students found
                </td>
            </tr>
        `;

        return;
    }


    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${student.rollno}</td>

            <td>${student.name}</td>

            <td>${student.percentage}</td>

            <td>${student.branch}</td>

            <td>

                <button
                    onclick="editStudent(${student.rollno})"
                    class="edit-btn">
                    ✏️
                </button>

                <button
                    onclick="deleteStudent(${student.rollno})"
                    class="delete-btn">
                    🗑️
                </button>

            </td>

        `;

        table.appendChild(row);

    });
}


// ===============================
// ADD STUDENT
// ===============================

const addStudentBtn =
    document.getElementById("addStudentBtn");


addStudentBtn.addEventListener("click", async function () {

    const name = prompt("Enter student name:");

    if (!name) {
        return;
    }


    const percentage = prompt("Enter percentage:");

    if (!percentage) {
        return;
    }


    const branch = prompt("Enter branch:");

    if (!branch) {
        return;
    }


    const student = {

        name: name,

        percentage: parseFloat(percentage),

        branch: branch

    };


    try {

       const response = await fetch("/student/add", {

    method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": "Bearer " + token

            },

            body: JSON.stringify(student)

        });


        if (response.status === 401 ||
            response.status === 403) {

            alert("Session expired. Please login again.");

            localStorage.removeItem("token");

            window.location.href = "/index.html";

            return;
        }


        if (!response.ok) {

            const errorText = await response.text();

            console.error(errorText);

            alert("Failed to add student");

            return;
        }


        alert("Student added successfully!");


        // Reload students
        loadStudents();

    } catch (error) {

        console.error(error);

        alert("Something went wrong");

    }

});


// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(rollno) {

    const confirmDelete =
        confirm("Are you sure you want to delete this student?");


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `/student/delete/${rollno}`,
            {

                method: "DELETE",

                headers: {

                    "Authorization":
                        "Bearer " + token

                }

            }
        );


        if (!response.ok) {

            alert("Failed to delete student");

            return;
        }


        alert("Student deleted successfully!");


        loadStudents();

    } catch (error) {

        console.error(error);

        alert("Something went wrong");

    }

}


// ===============================
// EDIT STUDENT
// ===============================

async function editStudent(rollno) {

    const name =
        prompt("Enter new student name:");

    if (!name) {
        return;
    }


    const percentage =
        prompt("Enter new percentage:");

    if (!percentage) {
        return;
    }


    const branch =
        prompt("Enter new branch:");

    if (!branch) {
        return;
    }


    const student = {

        name: name,

        percentage: parseFloat(percentage),

        branch: branch

    };


    try {

        const response = await fetch(
            `/student/update/${rollno}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token

                },

                body: JSON.stringify(student)

            }
        );


        if (!response.ok) {

            alert("Failed to update student");

            return;
        }


        alert("Student updated successfully!");


        loadStudents();

    } catch (error) {

        console.error(error);

        alert("Something went wrong");

    }

}


// ===============================
// SEARCH STUDENTS
// ===============================

const searchInput =
    document.getElementById("searchInput");


searchInput.addEventListener("input", function () {

    const searchValue =
        searchInput.value.toLowerCase();


    const rows =
        document.querySelectorAll(
            "#studentTable tr"
        );


    rows.forEach(row => {

        const text =
            row.textContent.toLowerCase();


        if (text.includes(searchValue)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});


// ===============================
// LOGOUT
// ===============================

const logoutButton =
    document.getElementById("logout");


logoutButton.addEventListener("click", function () {

    localStorage.removeItem("token");

    window.location.href = "/index.html";

});


// ===============================
// START
// ===============================

loadStudents();