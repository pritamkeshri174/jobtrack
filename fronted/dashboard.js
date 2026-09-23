// ==========================================
// JOBTRACK - DASHBOARD JAVASCRIPT
// ==========================================


// ==========================================
// CHECK LOGIN
// ==========================================

const token = localStorage.getItem("jobtrackToken");

if (!token) {
    window.location.href = "login.html";
}


// ==========================================
// GET USER
// ==========================================

const user = JSON.parse(localStorage.getItem("jobtrackUser"));

if (user) {
    const welcomeUser = document.getElementById("welcomeUser");

    if (welcomeUser) {
        welcomeUser.textContent = `Welcome, ${user.name} 👋`;
    }
}


// ==========================================
// JOB DATA
// ==========================================

let jobs = [];

let editingJobId = null;


// ==========================================
// DOM ELEMENTS
// ==========================================

const jobModal = document.getElementById("jobModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

const jobForm = document.getElementById("jobForm");

const jobTableBody = document.getElementById("jobTableBody");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const logoutBtn = document.getElementById("logoutBtn");


// ==========================================
// OPEN MODAL
// ==========================================

if (openModalBtn) {

    openModalBtn.addEventListener("click", () => {

        editingJobId = null;

        document.getElementById("modalTitle").textContent =
            "Add Job Application";

        jobForm.reset();

        jobModal.classList.add("active");
    });
}


// ==========================================
// CLOSE MODAL
// ==========================================

if (closeModalBtn) {

    closeModalBtn.addEventListener("click", () => {

        jobModal.classList.remove("active");

        editingJobId = null;
    });
}


// ==========================================
// CLOSE MODAL BY CLICKING OUTSIDE
// ==========================================

if (jobModal) {

    jobModal.addEventListener("click", (e) => {

        if (e.target === jobModal) {

            jobModal.classList.remove("active");

            editingJobId = null;
        }
    });
}


// ==========================================
// ADD / EDIT JOB
// ==========================================

if (jobForm) {

    jobForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const company =
            document.getElementById("company").value.trim();

        const position =
            document.getElementById("position").value.trim();

        const location =
            document.getElementById("location").value.trim();

        const jobType =
            document.getElementById("jobType").value;

        const status =
            document.getElementById("status").value;

        const salary =
            document.getElementById("salary").value.trim();

        const notes =
            document.getElementById("notes").value.trim();


        // Validation

        if (!company || !position) {

            alert("Company and Position are required ❌");

            return;
        }


        // ==========================================
        // EDIT
        // ==========================================

      if (editingJobId !== null) {

    try {

        const response = await fetch(
            `https://jobtrack-kohl.vercel.app/api/jobs/${editingJobId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    company,
                    position,
                    location: location || "Remote",
                    jobType,
                    status,
                    salary: salary || "Not specified",
                    notes
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to update application ❌");
            return;
        }

        // Update frontend with backend data
        const jobIndex = jobs.findIndex(
            job => String(job._id || job.id) === String(editingJobId)
        );

        if (jobIndex !== -1) {
            jobs[jobIndex] = data.job;
        }

        showToast("Application updated successfully 🎉");

    } catch (error) {

        console.error("Update Job Error:", error);

        alert("Server connection failed ❌");
        return;
    }
}

        // ==========================================
        // ADD
        // ==========================================

        else {

    const newJob = await addJobToBackend({

        user: user.id,

        company,

        position,

        location: location || "Remote",

        jobType,

        status,

        salary: salary || "Not specified",

        notes
    });


    if (!newJob) {
        return;
    }


    jobs.push(newJob);

    showToast("Application saved successfully 🎉");
}
        // ==========================================
        // REFRESH UI
        // ==========================================

        renderJobs();
        updateStatistics();
        updateApplicationChart();

        jobModal.classList.remove("active");

        jobForm.reset();

        editingJobId = null;

        document.getElementById("modalTitle").textContent =
            "Add Job Application";


        // ==========================================
        // SAVE
        // ==========================================

        if (editingJobId !== null) {
            saveJobs();
}

        renderJobs();

        updateStatistics();

        updateApplicationChart();


        // ==========================================
        // CLOSE
        // ==========================================

        jobModal.classList.remove("active");

        editingJobId = null;

        jobForm.reset();
    });
}


// ==========================================
// SAVE JOBS
// ==========================================

function saveJobs() {

    localStorage.setItem(
        "jobtrackJobs",
        JSON.stringify(jobs)
    );
}


// ==========================================
// RENDER JOBS
// ==========================================

function renderJobs() {

    if (!jobTableBody) return;

    jobTableBody.innerHTML = "";


    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "All";


    const filteredJobs = jobs.filter(job => {

        const matchesSearch =

            (job.company || "")
                .toLowerCase()
                .includes(searchText)

            ||

            (job.position || "")
                .toLowerCase()
                .includes(searchText)

            ||

            (job.location || "")
                .toLowerCase()
                .includes(searchText);


        const matchesStatus =

            selectedStatus === "All" ||

            job.status === selectedStatus;


        return matchesSearch && matchesStatus;
    });


    // ==========================================
    // EMPTY
    // ==========================================

    if (filteredJobs.length === 0) {

        emptyMessage.style.display = "block";

        return;

    } else {

        emptyMessage.style.display = "none";
    }


    // ==========================================
    // CREATE ROWS
    // ==========================================

    filteredJobs.forEach(job => {

        const row = document.createElement("tr");


        const formattedDate =

            new Date(
                job.applicationDate || job.createdAt
            )
                .toLocaleDateString("en-IN");


        const statusClass =
            (job.status || "Applied").toLowerCase();


        const jobId = job._id || job.id;


        row.innerHTML = `

            <td>
                ${escapeHTML(job.company)}
            </td>

            <td>
                ${escapeHTML(job.position)}
            </td>

            <td>
                ${escapeHTML(job.location || "Remote")}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${escapeHTML(job.status || "Applied")}
                </span>
            </td>

            <td>
                ${formattedDate}
            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="viewJob('${jobId}')"
                    title="View Details"
                >
                    👁️
                </button>

                <button
                    class="action-btn"
                    onclick="editJob('${jobId}')"
                    title="Edit"
                >
                    ✏️
                </button>

                <button
                    class="action-btn"
                    onclick="deleteJob('${jobId}')"
                    title="Delete"
                >
                    🗑️
                </button>

            </td>
        `;


        jobTableBody.appendChild(row);
    });
}


// ==========================================
// VIEW JOB
// ==========================================

function viewJob(id) {

    const job = jobs.find(
        job => String(job._id || job.id) === String(id)
    );

    if (!job) return;


    document.getElementById("viewCompany").textContent =
        job.company;

    document.getElementById("viewPosition").textContent =
        job.position;

    document.getElementById("viewLocation").textContent =
        job.location || "Remote";

    document.getElementById("viewJobType").textContent =
        job.jobType || "Full Time";

    document.getElementById("viewStatus").textContent =
        job.status || "Applied";

    document.getElementById("viewSalary").textContent =
        job.salary || "Not specified";


    document.getElementById("viewDate").textContent =

        new Date(
            job.applicationDate || job.createdAt
        )
            .toLocaleDateString("en-IN");


    document.getElementById("viewNotes").textContent =
        job.notes || "No notes added.";


    document.getElementById("viewModal").classList.add("active");
}


// ==========================================
// CLOSE VIEW MODAL
// ==========================================

const viewModal =
    document.getElementById("viewModal");

const closeViewModalBtn =
    document.getElementById("closeViewModalBtn");


if (closeViewModalBtn) {

    closeViewModalBtn.addEventListener("click", () => {

        viewModal.classList.remove("active");
    });
}


if (viewModal) {

    viewModal.addEventListener("click", (e) => {

        if (e.target === viewModal) {

            viewModal.classList.remove("active");
        }
    });
}


// ==========================================
// EDIT JOB
// ==========================================

// ==========================================
// EDIT JOB
// ==========================================

function editJob(id) {

    const job = jobs.find(
        job => String(job._id || job.id) === String(id)
    );

    if (!job) return;

    editingJobId = job._id || job.id;

    document.getElementById("modalTitle").textContent =
        "Edit Job Application";

    document.getElementById("company").value =
        job.company || "";

    document.getElementById("position").value =
        job.position || "";

    document.getElementById("location").value =
        job.location || "";

    document.getElementById("jobType").value =
        job.jobType || "Full Time";

    document.getElementById("status").value =
        job.status || "Applied";

    document.getElementById("salary").value =
        job.salary === "Not specified"
            ? ""
            : job.salary || "";

    document.getElementById("notes").value =
        job.notes || "";

    jobModal.classList.add("active");
}


// ==========================================
// DELETE JOB
// ==========================================

async function deleteJob(id) {

    const job = jobs.find(
        job => String(job._id || job.id) === String(id)
    );

    if (!job) return;

    const confirmDelete = confirm(
        `Delete application for ${job.company}?`
    );

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `https://jobtrack-kohl.vercel.app/api/jobs/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to delete application ❌");
            return;
        }

        // Remove from frontend
        jobs = jobs.filter(
            job => String(job._id || job.id) !== String(id)
        );

        renderJobs();
        updateStatistics();
        updateApplicationChart();

        showToast(
            "Application deleted successfully!",
            "🗑️"
        );

    } catch (error) {

        console.error("Delete Job Error:", error);

        alert("Server connection failed ❌");
    }
}

// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderJobs
    );
}


// ==========================================
// FILTER
// ==========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderJobs
    );
}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const total =
        jobs.length;


    const applied =
        jobs.filter(
            job => job.status === "Applied"
        ).length;


    const interview =
        jobs.filter(
            job => job.status === "Interview"
        ).length;


    const selected =
        jobs.filter(
            job => job.status === "Selected"
        ).length;


    document.getElementById("totalJobs").textContent =
        total;


    document.getElementById("appliedJobs").textContent =
        applied;


    document.getElementById("interviewJobs").textContent =
        interview;


    document.getElementById("selectedJobs").textContent =
        selected;
}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("jobtrackToken");

        localStorage.removeItem("jobtrackUser");

        window.location.href = "login.html";
    });
}


// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ==========================================
// INITIAL LOAD
// ==========================================

renderJobs();

updateStatistics();

updateApplicationChart();


// ==========================================
// UPDATE APPLICATION CHART
// ==========================================

function updateApplicationChart() {

    const applied =
        jobs.filter(
            job => job.status === "Applied"
        ).length;


    const interview =
        jobs.filter(
            job => job.status === "Interview"
        ).length;


    const selected =
        jobs.filter(
            job => job.status === "Selected"
        ).length;


    const rejected =
        jobs.filter(
            job => job.status === "Rejected"
        ).length;


    const total =
        applied +
        interview +
        selected +
        rejected;


    document.getElementById("appliedCount").textContent =
        applied;


    document.getElementById("interviewCount").textContent =
        interview;


    document.getElementById("selectedCount").textContent =
        selected;


    document.getElementById("rejectedCount").textContent =
        rejected;


    document.getElementById("appliedBar").style.width =
        total
            ? `${(applied / total) * 100}%`
            : "0%";


    document.getElementById("interviewBar").style.width =
        total
            ? `${(interview / total) * 100}%`
            : "0%";


    document.getElementById("selectedBar").style.width =
        total
            ? `${(selected / total) * 100}%`
            : "0%";


    document.getElementById("rejectedBar").style.width =
        total
            ? `${(rejected / total) * 100}%`
            : "0%";
}
// ==========================================
// TOAST NOTIFICATION
// ==========================================

function showToast(message, icon = "✅") {

    const toast =
        document.getElementById("toast");

    const toastMessage =
        document.getElementById("toastMessage");

    const toastIcon =
        document.getElementById("toastIcon");

    if (!toast) return;

    toastMessage.textContent =
        message;

    toastIcon.textContent =
        icon;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// ==========================================
// ADD JOB TO BACKEND
// ==========================================

async function addJobToBackend(jobData) {

    try {

        const response = await fetch(
            "https://jobtrack-kohl.vercel.app/api/jobs",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(jobData)
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to save application ❌"
            );

            return null;
        }

        return data.job;

    } catch (error) {

        console.error(
            "Add Job Error:",
            error
        );

        alert(
            "Server connection failed ❌"
        );

        return null;
    }
}


// ==========================================
// LOAD JOBS FROM BACKEND
// ==========================================

async function loadJobsFromBackend() {

    try {

        const response = await fetch(
            "https://jobtrack-kohl.vercel.app/api/jobs",
            {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "Failed to load jobs:",
                data
            );

            return;
        }

        jobs = data;

        renderJobs();

        updateStatistics();

        updateApplicationChart();

        console.log(
            "Jobs loaded from MongoDB:",
            jobs
        );

    } catch (error) {

        console.error(
            "Load Jobs Error:",
            error
        );
    }
}


// ==========================================
// LOAD JOBS
// ==========================================

loadJobsFromBackend();