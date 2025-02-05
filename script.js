document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('#draggable-list li');
    const saveButton = document.getElementById('save-order');

    listItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });

    saveButton.addEventListener('click', saveOrder);

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(e.clientY);
        const list = document.getElementById('draggable-list');
        if (afterElement == null) {
            list.appendChild(draggingItem);
        } else {
            list.insertBefore(draggingItem, afterElement);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function getDragAfterElement(y) {
        const listItems = [...document.querySelectorAll('#draggable-list li:not(.dragging)')];
        return listItems.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveOrder() {
        const listItems = document.querySelectorAll('#draggable-list li');
        const order = Array.from(listItems).map(item => item.id);
		
		console.log(listItems);
		console.log(order);

        fetch('https://your-api-endpoint.com/save-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});