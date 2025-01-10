document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente carregado e analisado');

    const boardsContainer = document.getElementById('boards-container');
    const createBoardButton = document.getElementById('create-board');
    const editBoardButton = document.getElementById('edit-board');
    const showBoardsButton = document.getElementById('show-boards');
    const boardsList = document.getElementById('boards-list');
    let boardCounter = 0;
    let currentBoard = null; // Variável para armazenar o quadro atual
    

    if (createBoardButton) {
        createBoardButton.addEventListener('click', createBoard);
        console.log('Listener adicionado ao botão "Criar Quadro"');
    } else {
        console.log('Botão "Criar Quadro" não encontrado');
    }

    if (editBoardButton) {
        editBoardButton.addEventListener('click', editBoard);
        console.log('Listener adicionado ao botão "Editar Quadro"');
    } else {
        console.log('Botão "Editar Quadro" não encontrado');
    }

    function createBoard() {
        boardCounter++;
        const boardId = `board-${boardCounter}`;
        console.log('Botão "Criar Quadro" clicado');
        const board = document.createElement('div');
        board.className = 'board';
        board.id = boardId;
        board.innerHTML = `
            <input type="text" placeholder="Título do Quadro" class="board-title" oninput="updateBoardTitle('${boardId}')">
            <button class="add-list">Adicionar Lista</button>
            <button class="delete-board">Remover Quadro</button>
            <div class="lists-container"></div>
        `;
        boardsContainer.appendChild(board);
        addListFunctionality(board);
        makeListsSortable(board.querySelector('.lists-container')); // Permitir arrastar listas

        const deleteBoardButton = board.querySelector('.delete-board');
        deleteBoardButton.addEventListener('click', () => {
            deleteBoard(board);
            removeBoardFromList(boardId);
            toggleShowBoardsButton();
        });

        addBoardToMenu(boardId, board);
        selectBoard(boardId); // Seleciona o quadro criado
        toggleShowBoardsButton();
    }

    function deleteBoard(board) {
        board.remove();
        console.log('Quadro removido');
    }

    function addListFunctionality(board) {
        const addListButton = board.querySelector('.add-list');

        addListButton.addEventListener('click', () => {
            const list = document.createElement('div');
            list.className = 'list';
            list.innerHTML = `
                <input type="text" placeholder="Título da Lista" class="list-title">
                <button class="delete-list">Remover Lista</button>
                <div class="cards-container"></div>
                <button class="add-card">Adicionar Cartão</button>
            `;
            board.querySelector('.lists-container').appendChild(list);
            addCardFunctionality(list);
            makeCardsSortable(list.querySelector('.cards-container')); // Permitir arrastar cartões mesmo na lista vazia

            const deleteListButton = list.querySelector('.delete-list');
            deleteListButton.addEventListener('click', () => deleteList(list));
        });
    }

    function deleteList(list) {
        list.remove();
        console.log('Lista removida');
    }
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializa a funcionalidade de adicionar cartões para todas as listas na página
        document.querySelectorAll('.list').forEach(list => {
            addCardFunctionality(list);
        });
    
        // Inicializa a funcionalidade de adicionar listas para o contêiner de quadros
        const listsContainer = document.querySelector('.lists-container');
        if (listsContainer) {
            makeListsSortable(listsContainer);
        }
    });
    
    function addBoardToMenu(boardId, board) {
        const boardTitle = board.querySelector('.board-title').value || `Quadro ${boardCounter}`;
        const listItem = document.createElement('li');
        listItem.id = `menu-${boardId}`;
        listItem.innerHTML = `
            <span id="title-${boardId}">${boardTitle}</span>
            <button>Remover</button>
        `;
        boardsList.appendChild(listItem);

        listItem.addEventListener('click', () => {
            selectBoard(boardId);
        });

        listItem.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteBoard(board);
            removeBoardFromList(boardId);
            toggleShowBoardsButton();
        });
    }

    function removeBoardFromList(boardId) {
        const listItem = document.getElementById(`menu-${boardId}`);
        if (listItem) {
            listItem.remove();
        }

        // Esconde o botão "Editar Quadro" se o quadro atual foi removido
        if (currentBoard && currentBoard.id === boardId) {
            editBoardButton.style.display = 'none';
            currentBoard = null;
        }
    }

    function toggleShowBoardsButton() {
        if (boardCounter > 1) {
            showBoardsButton.style.display = 'block';
        } else {
            showBoardsButton.style.display = 'none';
        }
    }

    function setActiveBoard(activeListItem) {
        document.querySelectorAll('#boards-list li').forEach(li => li.classList.remove('active'));
        activeListItem.classList.add('active');
    }

    function selectBoard(boardId) {
        document.querySelectorAll('.board').forEach(b => b.style.display = 'none');
        const board = document.getElementById(boardId);
        board.style.display = 'block';
        currentBoard = board; // Armazena o quadro atual

        const listItem = document.getElementById(`menu-${boardId}`);
        setActiveBoard(listItem);

        // Exibe o botão "Editar Quadro" quando um quadro estiver sendo visualizado
        editBoardButton.style.display = 'block';
    }

    function editBoard() {
        if (!currentBoard) return;

        // Cria os inputs para editar a cor de fundo e a cor de texto
        const editContainer = document.createElement('div');
        editContainer.className = 'edit-container';
        editContainer.innerHTML = `
            <label for="background-color">Cor de Fundo:</label>
            <input type="color" id="background-color" name="background-color" value="${getComputedStyle(currentBoard).backgroundColor}">
            <label for="text-color">Cor do Texto:</label>
            <input type="color" id="text-color" name="text-color" value="${getComputedStyle(currentBoard).color}">
            <button id="save-changes">Salvar</button>
            <button id="cancel-changes">Cancelar</button>
        `;

        currentBoard.appendChild(editContainer);

        document.getElementById('save-changes').addEventListener('click', saveChanges);
        document.getElementById('cancel-changes').addEventListener('click', () => {
            editContainer.remove();
        });
    }

    function saveChanges() {
        const backgroundColorInput = document.getElementById('background-color');
        const textColorInput = document.getElementById('text-color');

        if (currentBoard && backgroundColorInput && textColorInput) {
            currentBoard.style.backgroundColor = backgroundColorInput.value;
            currentBoard.style.color = textColorInput.value;
            // Aplicar cor de texto para todos os elementos do quadro, exceto os botões
            currentBoard.querySelectorAll('.list-title, .card-title, .card-content, .card-dates').forEach(element => {
                element.style.color = textColorInput.value;
            });
        }

        // Simula salvamento no servidor (ajuste conforme necessário para integrar com backend)
        const boardId = currentBoard.id;
        const newBackgroundColor = backgroundColorInput.value;
        const newTextColor = textColorInput.value;
        fetch(`/boards/${boardId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                backgroundColor: newBackgroundColor,
                textColor: newTextColor
            })
        }).then(response => response.json()).then(data => {
            console.log('Mudanças salvas:', data);
        }).catch(error => {
            console.error('Erro ao salvar mudanças:', error);
        });

        document.querySelector('.edit-container').remove();
    }

    function removeBoardFromList(boardId) {
        const listItem = document.getElementById(`menu-${boardId}`);
        if (listItem) {
            listItem.remove();
        }

        // Esconde o botão "Editar Quadro" se o quadro atual foi removido
        if (currentBoard && currentBoard.id === boardId) {
            editBoardButton.style.display = 'none';
            currentBoard = null;
        }
    }

    function toggleShowBoardsButton() {
        if (boardCounter > 1) {
            showBoardsButton.style.display = 'block';
        } else {
            showBoardsButton.style.display = 'none';
        }
    }

    function setActiveBoard(activeListItem) {
        document.querySelectorAll('#boards-list li').forEach(li => li.classList.remove('active'));
        activeListItem.classList.add('active');
    }

    function selectBoard(boardId) {
        document.querySelectorAll('.board').forEach(b => b.style.display = 'none');
        const board = document.getElementById(boardId);
        board.style.display = 'block';
        currentBoard = board; // Armazena o quadro atual

        const listItem = document.getElementById(`menu-${boardId}`);
        setActiveBoard(listItem);

        // Exibe o botão "Editar Quadro" quando um quadro estiver sendo visualizado
        editBoardButton.style.display = 'block';
    }
});

document.querySelector('#show-boards').addEventListener('click', function() {
    document.querySelector('#boards-menu').classList.toggle('active');
});

// Arquivo dashboard.js
// Array para armazenar os IDs dos quadros favoritos
let favoriteBoards = JSON.parse(localStorage.getItem('favoriteBoards')) || [];

// Função para alternar o estado de favorito
function toggleFavorite(boardId) {
    const boardIndex = favoriteBoards.indexOf(boardId);
    if (boardIndex > -1) {
        // Remove dos favoritos
        favoriteBoards.splice(boardIndex, 1);
    } else {
        // Adiciona aos favoritos
        favoriteBoards.push(boardId);
    }
    // Atualiza o armazenamento local
    localStorage.setItem('favoriteBoards', JSON.stringify(favoriteBoards));
    // Atualiza a exibição dos ícones
    updateFavoriteIcons();
}

// Função para atualizar a exibição dos ícones de estrela
function updateFavoriteIcons() {
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        const boardId = icon.getAttribute('onclick').split("'")[1];
        if (favoriteBoards.includes(boardId)) {
            icon.classList.add('favorite');
        } else {
            icon.classList.remove('favorite');
        }
    });
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', updateFavoriteIcons);

