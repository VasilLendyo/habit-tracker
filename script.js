// Знаходжу кнопки в HTML, щоб потім змусити її працювати
const habitInput = document.getElementById('habit-input');
const addBtn = document.getElementById('add-btn');
const habitList = document.getElementById('habit-list');
const progressText = document.getElementById('progress-text');
const clearAllBtn = document.getElementById('clear-all-btn');

// Завантажуємо звички зі сховища або створюємо порожній масив, якщо там ще нічого немає
let habits = JSON.parse(localStorage.getItem('my_habits')) || [];

// Функція для збереження масиву звичок у локальне сховище браузера
function saveHabits() {
        localStorage.setItem('my_habits', JSON.stringify(habits));
}

//відмальвка в браузері
function renderHabits(){
    // Очищення списку перед кожним новим малюванням
    habitList.innerHTML = '';

    // --- РАХУЄМО ПРОГРЕС ТА ДИНАМІЧНО ЗМІНЮЄМО КОЛІР ---
    const totalHabits = habits.length;  // Загальна кількість звичок у масиві
    const completeHabits = habits.filter(habit => habit.done).length; // Кількість виконаних

    // Розрахунок відсотка з округленням до цілого числа
    const pecentage = totalHabits > 0 ? Math.round((completeHabits / totalHabits) * 100) : 0;

    // Виводимо оновлений текст у HTML
    progressText.textContent = `Виконано: ${completeHabits} з ${totalHabits} (${pecentage}%)`;

    // Скидаємо всі поперідні класи кольору, щоб вони не накладались
    progressText.className = '';

    // Перевіряємо відсоток і додаємо відповідинй клас для стилізації
    if (totalHabits === 0 || pecentage === 0) {
        // Якщо список порожній або виконано 0% — фарбуємо в червоний
        progressText.classList.add('progress-low');
    } else if (pecentage === 100) {
        // Якщо виконано абсолютно всі звички (100%) — фарбуємо в зелений
        progressText.classList.add('progress-full');
    } else {
        // Усі проміжні варіанти від 1% до 99% — фарбуємо в жовтий/помаранчевий
        progressText.classList.add('progress-medium');
    }

    //Перебирання нашого масиву
    habits.forEach((habit, index) => {
        // Створення нового елемента списку в пам'яті
        const li = document.createElement('li');
        //присвоєння класу елементу списку для підключення CSS-стилів
        li.className = 'habit-item';
        
        // Створення HTML-елементу span для тексту звички
        const textSpan = document.createElement('span');
            // Внесення тексту та дати з масиву в цей span
            // Якщо у старих звичок немає дати (бо вони були створені раніше), виведеться просто текс
            const habitDate = habit.date ? ` (${habit.date})` : '';
            textSpan.textContent = `${habit.text}${habitDate}`;
            textSpan.className = 'habit-text';

        //Перевірка стану об'єкта (виконано чи ні) і додавання класу для перекреслення тексту
        if(habit.done) {
            textSpan.classList.add('completed');
        }

        //Додаємо подію кліку на текст звички для зміни статусу (виконано/ні) та оновлення екрану
        textSpan.addEventListener('click', () => {
            habit.done = !habit.done; // перемикаємо статус на протилежний
            renderHabits(); // перемальовуємо візуал з новими стилями
        });


        // Вкладаємо тег span з текстом всередину нашого елемента списку li
        li.appendChild(textSpan);

        //створення кнопки для видалення елементу
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌'; //вміст кнопки
        deleteBtn.className = 'delete-btn'; //присвоєння класу

        // Навішуємо подію кліку на кнопку видалення
        deleteBtn.addEventListener('click', () => {
            habits.splice(index, 1); // Видаляємо з масиву 1 елемент за його порядковим номером (індексом)
            renderHabits(); // Перемальовуємо список у браузері вже без цього елемента
        });

        // Вкладаємо кнопку видалення всередину нашого елемента списку li
        li.appendChild(deleteBtn);
        // Вкладаємо елементи списку у сам список
        habitList.appendChild(li);
    });

    saveHabits();
}

// Навішуємо подію кліку на кнопку "Додати"
addBtn.addEventListener('click', () => {
    // Отримуємо текст з інпуту та очищаємо його від зайвих пробілів по краях
    const text = habitInput.value.trim();

    // Перевірка на введення пустого рядка
    if(text === '') {
        alert('Введіть назву звички!'); // Виводимо попередження
        return; // Зупиняємо виконання функції, щоб порожня звичка не додалася
    }

    // Отримуємо поточну дату та час
    const now = new Date();
    // Якщо число менше 10, додаємо 0 попереду (наприклад, "09" замість "9")
    const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
    // Місяці в JS рахуються з 0, тому додаємо 1. Також додаємо 0 попереду, якщо потрібно
    const month = (now.getMonth() + 1) < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
    const dateString = `${day}.${month}`; // Отримаємо рядок типу "09.07"

    // Додаємо в масив об'єкт, який тепер має ще й властивості date
    habits.push({
        text: text,
        done: false,
        date: dateString // Зберігаємо дату створення
    });

    // Очищаємо поле
    habitInput.value = '';
    renderHabits(); //перемальвуємо візуал в браузері з новою звичкою
})

// щоб відмалювати ті звички, які дістали з LocalStorage
renderHabits();

// Навішуємо подію кліку на кнопку "Очисти все"
clearAllBtn.addEventListener('click', () => {
    // Питаємо згоду користувача, щоб він не видалив все випадково
    const confirmDelete = confirm('Ви впевнені, що хочете видалити ВСІ звички?');

    if(confirmDelete) {
        habits = []; // Повністю спуштошуємо наш масив звичок
        renderHabits(); // Перемальовуємо візуал (він автоматично збереже порожній масив у LocalStorage)
    }
})