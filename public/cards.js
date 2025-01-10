function addCardFunctionality(list) {
    const addCardButton = list.querySelector('.add-card');

    if (addCardButton) {
        addCardButton.addEventListener('click', () => {
            createCard(list);
        });
    }

    function createCard(list) {
        const cardsContainer = list.querySelector('.cards-container');
        const card = document.createElement('div');
        card.className = 'card';
        const createdAt = new Date().toLocaleString();
        const updatedAt = new Date().toLocaleString();
        card.dataset.createdAt = createdAt;
        card.dataset.updatedAt = updatedAt;
        card.innerHTML = `
            <textarea placeholder="Título do Cartão" class="card-title"></textarea>
            <p class="card-content"></p>
            <div class="card-dates fixed-dates">
                <span class="created-date">Criado em: ${createdAt}</span><br>
                <span class="updated-date">Última modificação: ${updatedAt}</span>
            </div>
            <button class="delete-card-icon">🗑️</button> <!-- Ícone de lixeira -->
        `;
        cardsContainer.appendChild(card); // Certificando que o cartão é adicionado ao contêiner de cartões
        makeCardsSortable(cardsContainer);

        const deleteCardButton = card.querySelector('.delete-card-icon');
        deleteCardButton.addEventListener('click', () => deleteCard(card));

        const titleInput = card.querySelector('.card-title');
        titleInput.addEventListener('input', () => updateCardModificationDate(card));
    }
}

function makeCardsSortable(cardsContainer) {
    new Sortable(cardsContainer, {
        group: 'cards',
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: (evt) => {
            const card = evt.item;
            updateCardModificationDate(card);
            console.log(`Card ${evt.item.querySelector('.card-title').value} movido para a lista ${evt.to.parentNode.id}`);
        }
    });
}

function makeListsSortable(listsContainer) {
    new Sortable(listsContainer, {
        group: 'lists',
        animation: 150,
        handle: '.list-title',
        ghostClass: 'sortable-ghost',
        onEnd: (evt) => {
            console.log(`Lista ${evt.item.querySelector('.list-title').value} movida para a posição ${evt.newIndex}`);
        }
    });
}

function updateCardModificationDate(card) {
    const updatedAt = new Date().toLocaleString();
    card.dataset.updatedAt = updatedAt;
    const updatedDateSpan = card.querySelector('.updated-date');
    updatedDateSpan.textContent = `Última modificação: ${updatedAt}`;
    console.log('Data de última modificação atualizada');
}

function deleteCard(card) {
    card.remove();
    console.log('Cartão removido');
}