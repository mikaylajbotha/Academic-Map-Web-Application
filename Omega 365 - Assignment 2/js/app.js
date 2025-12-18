document.addEventListener('DOMContentLoaded', () => {
    const degreeSelect = document.getElementById('degree-select');
    
    // Load academic map when the degree is selected
    degreeSelect.addEventListener('change', loadAcademicMap);
    loadAcademicMap(); // Load initial academic map

    // Function to toggle edit mode in course management
    function toggleEdit(button) {
        const semesterYearDiv = button.closest('.semester-year');
        const editButton = semesterYearDiv.querySelector('.edit-courses-btn');
        const editOptionsDiv = semesterYearDiv.querySelector('.edit-options');
        const saveButton = editOptionsDiv.querySelector('.save-btn');
        const doneButton = editOptionsDiv.querySelector('.done-btn');
        const cancelButton = editOptionsDiv.querySelector('.cancel-btn');
        const removeCoursesButton = editOptionsDiv.querySelector('.remove-course-btn');
        const removeButtons = semesterYearDiv.querySelectorAll('.remove-btn');

        const isEditing = !editOptionsDiv.classList.contains('hidden');

        if (isEditing) {
            // Exiting edit mode (when Save, Done, or Cancel is clicked)
            editOptionsDiv.classList.add('hidden');
            saveButton.classList.add('hidden');
            doneButton.classList.add('hidden'); // Hide Done button
            cancelButton.classList.add('hidden');
            editButton.classList.remove('hidden'); // Show the Edit Courses button again
            removeCoursesButton.classList.add('hidden'); // Hide the Remove Courses button
            removeButtons.forEach(btn => btn.classList.add('hidden')); // Hide all remove buttons
        } else {
            // Entering edit mode (when Edit Courses is clicked)
            editOptionsDiv.classList.remove('hidden');
            saveButton.classList.remove('hidden');
            doneButton.classList.remove('hidden'); // Show Done button
            cancelButton.classList.remove('hidden');
            editButton.classList.add('hidden'); // Hide the Edit Courses button
            removeCoursesButton.classList.remove('hidden'); // Show the Remove Courses button
            removeButtons.forEach(btn => btn.classList.add('hidden')); // Hide remove buttons initially
        }
    }

    // Function to handle cancel button click, exiting edit mode
    function cancelEdit(button) {
        toggleEdit(button); // Exit edit mode and show the Edit Courses button again
    }

    // Function to handle Remove Courses button click, toggling remove buttons visibility
    function toggleRemove(button) {
        const semesterYearDiv = button.closest('.semester-year');
        const removeButtons = semesterYearDiv.querySelectorAll('.remove-btn');

        // Toggle visibility of remove buttons
        removeButtons.forEach(btn => {
            if (btn.classList.contains('hidden')) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        });
    }

    // Event delegation for various button clicks
    document.addEventListener('click', event => {
        const target = event.target;
        if (target.matches('.add-course-btn')) {
            openAddCourseModal(target.dataset.semesterId); // Open modal to add a course
        } else if (target.matches('.edit-courses-btn')) {
            toggleEdit(target); // Toggle edit mode for a semester
        } else if (target.matches('.remove-course-btn')) {
            toggleRemove(target); // Toggle visibility of remove buttons
        } else if (target.matches('.save-btn')) {
            saveChanges(target); // Save changes in edit mode
        } else if (target.matches('.done-btn') || target.matches('.cancel-btn')) {
            cancelEdit(target); // Exit edit mode without saving changes
        } else if (target.matches('.remove-btn')) {
            removeCourse(target); // Remove a course from the semester
        } else if (target.matches('.course-link')) {
            fetchCourseDetails(target.dataset.courseId); // Fetch and display course details
        } else if (target.matches('#download-pdf')) {
            handleDownloadPdf(); // Trigger download of academic map as a PDF
        }
    });

    // Modal handling for adding a course
    const modal = document.getElementById('add-course-modal');
    const closeModalButton = modal.querySelector('.close-btn');
    const addCourseForm = document.getElementById('add-course-form');

    // Close the modal when the close button is clicked
    closeModalButton.addEventListener('click', () => {
        closeModal();
    });

    // Handle form submission for adding a course
    addCourseForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        const courseNum = document.getElementById('course-num').value;
        const title = document.getElementById('course-title').value;
        const creditHours = parseInt(document.getElementById('credit-hours').value, 10);
        const semesterID = modal.dataset.semesterId; // Get the semester ID from modal

        if (courseNum && title && !isNaN(creditHours) && semesterID) {
            addCourse(courseNum, title, creditHours, semesterID); // Add course to the selected semester
            closeModal(); // Close the modal after adding the course
            addCourseForm.reset(); // Clear the form for the next input
        } else {
            alert('Please fill out all fields correctly.'); // Alert if form validation fails
        }
    });

    
});

// Function to open the modal for adding a course
function openAddCourseModal(semesterID) {
    const modal = document.getElementById('add-course-modal');
    modal.classList.remove('hidden');
    modal.dataset.semesterId = semesterID; // Store the semester ID in the modal
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('add-course-modal');
    modal.classList.add('hidden');
}

// Function to add a course to the selected semester
function addCourse(courseNum, title, creditHours, semesterID) {
    const semesterYearDiv = document.getElementById(semesterID); // Use the semester ID to find the correct semester
    if (!semesterYearDiv) {
        alert('Selected semester not found.');
        return;
    }

    const tableBody = semesterYearDiv.querySelector('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${courseNum}</td>
        <td><a href="#" class="course-link" data-course-id="${courseNum}">${title}</a></td>
        <td>${creditHours}</td>
        <td><button class="remove-btn hidden">Remove</button></td> <!-- Ensure remove buttons are hidden initially -->
    `;
    tableBody.appendChild(row);

    // Update total hours for the semester
    const totalHoursDiv = semesterYearDiv.querySelector('.total-semester-hours');
    const currentTotal = parseInt(totalHoursDiv.textContent.replace('Total Credit Hours: ', ''), 10);
    totalHoursDiv.textContent = `Total Credit Hours: ${currentTotal + creditHours}`;
}

// Function to load the academic map based on the selected degree
async function loadAcademicMap() {
    const degreeSelect = document.getElementById('degree-select');
    const selectedDegree = degreeSelect.value;

    try {
        const response = await fetch('data/academicmap.json'); // Fetch academic map data from JSON file
        if (!response.ok) {
            throw new Error('Failed to load academic map');
        }
        const data = await response.json(); // Parse JSON response

        const program = data.programs.find(p => p.id === selectedDegree);
        if (!program) {
            throw new Error('Program not found');
        }

        const academicMapDiv = document.getElementById('academic-map');
        academicMapDiv.innerHTML = ''; // Clear previous content

        // Iterate over semesters and add courses to the map
        Object.entries(program.map).forEach(([semesterTitle, courses]) => {
            const semesterYearDiv = document.createElement('div');
            semesterYearDiv.classList.add('semester-year');
            const semesterID = `${semesterTitle.toLowerCase().replace(/\s+/g, '-')}`;
            semesterYearDiv.id = semesterID; // Set the ID for each semester

            const semesterTitleElement = document.createElement('h3');
            semesterTitleElement.textContent = semesterTitle;
            semesterYearDiv.appendChild(semesterTitleElement);

            // Create Edit Courses button
            const editButton = document.createElement('button');
            editButton.classList.add('edit-courses-btn');
            editButton.textContent = 'Edit Courses';
            semesterYearDiv.appendChild(editButton);

            // Create container for edit options
            const editOptionsDiv = document.createElement('div');
            editOptionsDiv.classList.add('edit-options', 'hidden');

            // Create Add Course button
            const addCourseButton = document.createElement('button');
            addCourseButton.classList.add('add-course-btn');
            addCourseButton.textContent = 'Add Course';
            addCourseButton.dataset.semesterId = semesterID; // Add semester ID to button
            editOptionsDiv.appendChild(addCourseButton);

            // Create Remove Courses button
            const removeCoursesButton = document.createElement('button');
            removeCoursesButton.classList.add('remove-course-btn', 'hidden'); // Hidden by default
            removeCoursesButton.textContent = 'Remove Courses';
            editOptionsDiv.appendChild(removeCoursesButton);

            // Create Save button
            const saveButton = document.createElement('button');
            saveButton.classList.add('save-btn', 'hidden');
            saveButton.textContent = 'Save';
            editOptionsDiv.appendChild(saveButton);

            // Create Done button
            const doneButton = document.createElement('button');
            doneButton.classList.add('done-btn', 'hidden'); // Hidden by default
            doneButton.textContent = 'Done';
            editOptionsDiv.appendChild(doneButton);

            // Create Cancel button
            const cancelButton = document.createElement('button');
            cancelButton.classList.add('cancel-btn', 'hidden');
            cancelButton.textContent = 'Cancel';
            editOptionsDiv.appendChild(cancelButton);

            semesterYearDiv.appendChild(editOptionsDiv);

            // Create table to display courses
            const table = document.createElement('table');
            table.classList.add('courses-table');

            const headerRow = document.createElement('tr');
            headerRow.innerHTML = '<th>Course Number</th><th>Title</th><th>Credit Hours</th><th>Action</th>';
            table.appendChild(headerRow);

            const tbody = document.createElement('tbody');
            let totalSemesterHours = 0;

            // Populate table with courses
            courses.forEach(course => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${course.courseNum}</td>
                    <td><a href="#" class="course-link" data-course-id="${course.courseNum}">${course.title}</a></td>
                    <td>${course.creditHours}</td>
                    <td><button class="remove-btn hidden">Remove</button></td> <!-- Ensure remove buttons are hidden initially -->
                `;
                tbody.appendChild(row);

                // Calculate total credit hours
                totalSemesterHours += course.creditHours;
            });

            table.appendChild(tbody);
            semesterYearDiv.appendChild(table);

            // Create total hours display
            const totalHoursDiv = document.createElement('div');
            totalHoursDiv.classList.add('total-semester-hours');
            totalHoursDiv.textContent = `Total Credit Hours: ${totalSemesterHours}`;
            semesterYearDiv.appendChild(totalHoursDiv);

            academicMapDiv.appendChild(semesterYearDiv);
        });
    } catch (error) {
        console.error('Error loading academic map:', error);
    }
}

// Function to handle course removal from a semester
function removeCourse(button) {
    const row = button.closest('tr');
    const semesterYearDiv = button.closest('.semester-year');
    const totalHoursDiv = semesterYearDiv.querySelector('.total-semester-hours');
    const creditHours = parseInt(row.children[2].textContent, 10);

    // Remove the row from the table
    row.remove();

    // Update total hours for the semester
    const currentTotal = parseInt(totalHoursDiv.textContent.replace('Total Credit Hours: ', ''), 10);
    totalHoursDiv.textContent = `Total Credit Hours: ${currentTotal - creditHours}`;
}

// Function to fetch course details 
function fetchCourseDetails(courseId) {
    console.log(`Fetching details for course ID: ${courseId}`);
}
