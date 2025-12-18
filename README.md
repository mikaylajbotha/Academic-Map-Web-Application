# Academic-Map-Web-Application

# Academic Map Web Application

## Overview
The Academic Map web application allows students and administrators to view, manage, and edit academic course plans for various degree programs. Users can select a degree, view the semester-wise course map, add or remove courses, and track total credit hours per semester.

---

## Features
- **Degree Selection:** Choose from multiple degrees to view the academic map.
- **Dynamic Academic Map:** Display semester-wise courses dynamically based on the selected degree.
- **Course Management:** 
  - Add new courses to any semester.
  - Remove existing courses.
  - Edit mode with Save, Done, and Cancel options for controlled modifications.
- **Search Courses:** Quickly search for courses by name or number.
- **Total Credit Hours:** Automatically calculate total credit hours for each semester.
- **Modal Interface:** User-friendly modal for adding new courses.

---

## File Structure
project/
│
├─ index.html # Main HTML file
├─ css/
│ └─ styles.css # External CSS styles
├─ js/
│ └─ app.js # Main JavaScript logic
├─ images/
│ └─ uh.png # University logo
├─ data/
│ └─ academicmap.json # Academic map data for all programs
└─ README.md # Project documentation


---

## Installation & Setup
1. Clone or download the repository.
2. Open `index.html` in your web browser.
3. Ensure that the `data/academicmap.json` file is accessible for the application to load academic maps correctly.

---

## Usage
1. **Select Degree:** Use the dropdown at the top to choose a degree program.
2. **View Academic Map:** The semester-wise courses for the selected degree will be displayed.
3. **Edit Courses:** 
   - Click "Edit Courses" for a semester to enter edit mode.
   - Use "Add Course" to open the modal and add a new course.
   - Use "Remove Courses" to reveal remove buttons and delete courses.
   - Click "Save", "Done", or "Cancel" to exit edit mode.
4. **Search Courses:** Type in the search box to filter courses by name or number.

---

## Technologies Used
- **HTML5** – Semantic markup for structure.
- **CSS3** – Styling for layout, tables, buttons, and modal.
- **JavaScript (ES6+)** – Dynamic interaction, DOM manipulation, event handling, and data fetching.
- **JSON** – Data storage for academic map programs and courses.

---
