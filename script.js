const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');

let habits = [];

function renderHabits(){
    habitList.innerHTML = ' ';

    habits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.textContent = habit;
        habitList.appendChild(li);
    })
}

addBtn.addEventListener('click', () => {
    const text = habitInput.value.trim();

    if(text === ' ') {
        alert('Введіть назву звички!');
        return;
    }

    habits.push(text);

    habitInput.value = ' ';

    renderHabits();
})
