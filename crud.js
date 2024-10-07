AFRAME.registerComponent('gerenciador-crud-usuario', {
    init: function () {
        this.usuarios = [];
        this.contadorUsuarios = 0;
        this.el.addEventListener('mouseenter', this.lidarComMouseEnter.bind(this));
        this.nomesReais = [
            "Ana Silva", "João Santos", "Maria Oliveira", "Pedro Costa",
            "Carla Rodrigues", "Lucas Ferreira", "Beatriz Almeida", "Gustavo Pereira",
            "Fernanda Lima", "Rafael Souza", "Juliana Martins", "André Gomes",
            "Mariana Castro", "Bruno Cardoso", "Camila Nunes", "Thiago Ribeiro"
        ];
        this.atualizarLayout = this.atualizarLayout.bind(this);
        this.lidarComSalvarEdicao = this.lidarComSalvarEdicao.bind(this);
        this.lidarComFecharEdicao = this.lidarComFecharEdicao.bind(this);

        this.campoEditando = null; // Campo que está sendo editado atualmente

        this.cameraRig = document.querySelector('#rig');

        // Adiciona eventos para ativar campo de edição com um delay de 1 segundo
        const inputs = document.querySelectorAll('#modalEdicao .input');
        inputs.forEach(input => {
            input.addEventListener('mouseenter', () => {
                this.editarTimeout = setTimeout(() => {
                    this.ativarCampo(input);
                }, 1000); // 1 segundo
            });
            input.addEventListener('mouseleave', () => {
                clearTimeout(this.editarTimeout); // Cancela a ativação se o mouse sair antes de 1 segundo
            });
        });

        // Teclas do teclado virtual para adicionar um delay ao digitar
        const teclas = document.querySelectorAll('#tecladoVirtual a-plane');
        teclas.forEach(tecla => {
            tecla.addEventListener('mouseenter', () => {
                this.teclaTimeout = setTimeout(() => {
                    this.lidarComTeclaPressionada({
                        target: tecla
                    });
                }, 1000); // 1.5 segundos
            });
            tecla.addEventListener('mouseleave', () => {
                clearTimeout(this.teclaTimeout); // Cancela a ação de digitar se o mouse sair antes de 1,5 segundos
            });
        });
    },

    ativarCampo: function (input) {
        this.campoEditando = input.querySelector('a-text');
        document.querySelector('#tecladoVirtual').setAttribute('visible', true);

        // Destaca o campo que está sendo editado
        const inputs = document.querySelectorAll('#modalEdicao .input');
        inputs.forEach(input => input.classList.remove('editando'));
        input.classList.add('editando');
    },


    ativarTeclado: function (evento) {
        // Ativa o teclado virtual e define qual campo está sendo editado
        const input = evento.target;
        this.campoEditando = input.querySelector('a-text');
        document.querySelector('#tecladoVirtual').setAttribute('visible', true);

        // Destaca o campo que está sendo editado (opcional)
        const inputs = document.querySelectorAll('#modalEdicao .input');
        inputs.forEach(input => input.classList.remove('editando'));
        input.classList.add('editando');
    },

    excluirUsuario: function (entidadeUsuario) {
        if (!entidadeUsuario) return;
    
        // Verifica se a entidade está no DOM antes de tentar removê-la
        if (entidadeUsuario.parentNode) {
            entidadeUsuario.parentNode.removeChild(entidadeUsuario);
        }
    
        // Atualiza a lista de usuários mantendo apenas os que não são o removido
        this.usuarios = this.usuarios.filter(usuario => usuario !== entidadeUsuario);
    
        // Atualiza o layout após a exclusão
        this.atualizarLayout();
    },    

    desativarTeclado: function () {
        // Desativa o teclado virtual quando o mouse sai do campo
        document.querySelector('#tecladoVirtual').setAttribute('visible', false);
    },

    lidarComTeclaPressionada: function (evento) {
        // Pega o valor da tecla pressionada
        const teclaPressionada = evento.target.getAttribute('text').value;

        // Atualiza o valor do campo que está sendo editado atualmente
        if (this.campoEditando) {
            let valorAtual = this.campoEditando.getAttribute('value');

            if (teclaPressionada === "Espaço") {
                valorAtual += " ";
            } else if (teclaPressionada === "Excluir") {
                // Remove o último caractere do valor atual
                valorAtual = valorAtual.slice(0, -1);
            } else {
                valorAtual += teclaPressionada;
            }

            this.campoEditando.setAttribute('value', valorAtual);
        }
    },

    lidarComMouseEnter: function (evento) {
        const elementoHover = evento.target;
        if (elementoHover.classList.contains('clicavel')) {
            const componenteTexto = elementoHover.getAttribute('text');
            
            if (componenteTexto && componenteTexto.value === 'Adicionar Usuario') {
                this.criarUsuario();
            } else if (elementoHover.classList.contains('botao-editar')) {
                // Delay de 1 segundo para editar
                this.editarTimeout = setTimeout(() => {
                    this.atualizarUsuario(elementoHover.closest('.usuario'));
                }, 500);
                elementoHover.addEventListener('mouseleave', () => {
                    clearTimeout(this.editarTimeout); // Cancela a edição se o mouse sair antes de 1 segundo
                });
            } else if (elementoHover.classList.contains('botao-excluir')) {
                // Delay de 1 segundo para excluir
                this.excluirTimeout = setTimeout(() => {
                    this.excluirUsuario(elementoHover.closest('.usuario'));
                }, 500);
                elementoHover.addEventListener('mouseleave', () => {
                    clearTimeout(this.excluirTimeout); // Cancela a exclusão se o mouse sair antes de 1 segundo
                });
            } else if (elementoHover.id === 'botaoSalvar') {
                this.lidarComSalvarEdicao();
            } else if (elementoHover.id === 'botaoFechar') {
                this.lidarComFecharEdicao();
            }
        }
    },
    

    criarUsuario: function () {
        // Cria um novo usuário com valores aleatórios e adiciona à lista
        this.contadorUsuarios++;
        const nomeUsuario = this.nomesReais[Math.floor(Math.random() * this.nomesReais.length)];
        const email = nomeUsuario.toLowerCase().replace(' ', '.') + '@exemplo.com';
        const idade = Math.floor(Math.random() * 50) + 18;
        
        const entidadeUsuario = document.createElement('a-entity');
        entidadeUsuario.setAttribute('geometry', 'primitive: plane; width: 1.5; height: 0.9');
        entidadeUsuario.setAttribute('material', 'color: #3498db; opacity: 0.9;');
        entidadeUsuario.setAttribute('class', 'usuario');
        
        const texto = document.createElement('a-text');
        texto.setAttribute('value', `Nome: ${nomeUsuario}\nEmail: ${email}\nIdade: ${idade}`);
        texto.setAttribute('align', 'center');
        texto.setAttribute('color', 'white');
        texto.setAttribute('width', 1.4);
        texto.setAttribute('wrapCount', 25);
        texto.setAttribute('baseline', 'center');
        texto.setAttribute('position', '0 0 0.01');
        texto.setAttribute('scale', '1.3 1.5 1');
        
        entidadeUsuario.appendChild(texto);
        
        // Criação dos botões circulares
        const botaoEditar = this.criarBotao('✎ Editar', 'botao-editar', '0.3 -0.7 0.05');
        const botaoExcluir = this.criarBotao('✖ Excluir', 'botao-excluir', '-0.3 -0.7 0.05');
        
        // Evento de edição com delay de 1 segundo
        botaoEditar.addEventListener('mouseenter', () => {
            this.editarTimeout = setTimeout(() => {
                this.atualizarUsuario(entidadeUsuario); // Realiza a edição após 1 segundo
            }, 1000); // 1 segundo de delay
        });
        botaoEditar.addEventListener('mouseleave', () => {
            clearTimeout(this.editarTimeout); // Cancela o evento de edição se o mouse sair antes de 1 segundo
        });
    
        // Evento de exclusão com delay de 1 segundo
        botaoExcluir.addEventListener('mouseenter', () => {
            this.excluirTimeout = setTimeout(() => {
                this.excluirUsuario(entidadeUsuario); // Realiza a exclusão após 1 segundo
            }, 1000); // 1 segundo de delay
        });
        botaoExcluir.addEventListener('mouseleave', () => {
            clearTimeout(this.excluirTimeout); // Cancela o evento de exclusão se o mouse sair antes de 1 segundo
        });
    
        entidadeUsuario.appendChild(botaoEditar);
        entidadeUsuario.appendChild(botaoExcluir);
    
        this.usuarios.push(entidadeUsuario);
        document.querySelector('#listaUsuarios').appendChild(entidadeUsuario);
    
        this.atualizarLayout();
    },
    
    

    criarBotao: function (simbolo, nomeClasse, posicao) {
        const botao = document.createElement('a-circle');
        botao.setAttribute('radius', '0.3');
        botao.setAttribute('color', nomeClasse === 'botao-editar' ? '#f39c12' : '#e74c3c');
        botao.setAttribute('position', posicao);
        botao.setAttribute('text', `value: ${simbolo}; align: center; color: white; wrapCount: 10; zOffset: 0.01`);
        botao.setAttribute('class', `clicavel ${nomeClasse}`);

        // Adiciona efeito visual ao passar o mouse (mouseenter e mouseleave)
        botao.addEventListener('mouseenter', () => {
            botao.setAttribute('scale', '1.2 1.2 1');
        });
        botao.addEventListener('mouseleave', () => {
            botao.setAttribute('scale', '1 1 1');
        });

        return botao;
    },

    atualizarLayout: function () {
        // Utilizando layout do A-Frame para reorganizar os elementos dos usuários
        const listaUsuarios = document.querySelector('#listaUsuarios');
        listaUsuarios.removeAttribute('layout'); // Remove o layout existente para permitir ajustes manuais

        // Atualiza as posições dos usuários manualmente
        this.usuarios.forEach((usuario, index) => {
            const coluna = index % 3; // Ajustei para 3 colunas para ter mais espaço
            const linha = Math.floor(index / 3);
            const posicaoX = coluna * 2.5; // Ajuste a distância entre colunas
            const posicaoY = -linha * 2.5; // Ajuste a distância entre linhas
            usuario.setAttribute('position', `${posicaoX} ${posicaoY} 0`);
        });
    },

    atualizarUsuario: function (entidadeUsuario) {
        if (!entidadeUsuario) return;

        // Obtém as informações do usuário a partir do texto existente
        const texto = entidadeUsuario.querySelector('a-text').getAttribute('value');
        const [nome, email, idade] = texto.split('\n').map(linha => linha.split(': ')[1]);

        // Atualiza os valores dos campos de input no modal de edição
        const modal = document.querySelector('#modalEdicao');
        modal.querySelector('#inputNome a-text').setAttribute('value', nome);
        modal.querySelector('#inputEmail a-text').setAttribute('value', email);
        modal.querySelector('#inputIdade a-text').setAttribute('value', idade);

        // Ativa o modal e o teclado com a câmera aproximando
        this.ativarModal();
        this.usuarioEditando = entidadeUsuario;
    },

    lidarComSalvarEdicao: function () {
        const modal = document.querySelector('#modalEdicao');
        const nome = modal.querySelector('#inputNome a-text').getAttribute('value');
        const email = modal.querySelector('#inputEmail a-text').getAttribute('value');
        const idade = modal.querySelector('#inputIdade a-text').getAttribute('value');

        if (this.usuarioEditando) {
            const texto = this.usuarioEditando.querySelector('a-text');
            texto.setAttribute('value', `Nome: ${nome}\nEmail: ${email}\nIdade: ${idade}`);
        }

        this.fecharModalEdicao();
    },

    lidarComFecharEdicao: function () {
        this.fecharModalEdicao();
    },

    ativarModal: function () {
        document.querySelector('#modalEdicao').setAttribute('visible', true);
        document.querySelector('#tecladoVirtual').setAttribute('visible', true);

        // Aplicar zoom movendo a câmera para mais perto
        this.cameraRig.setAttribute('position', '6 -2.5 4');
    },

    fecharModalEdicao: function () {
        // Esconde o modal e o teclado virtual
        const modal = document.querySelector('#modalEdicao');
        modal.setAttribute('visible', false);
        document.querySelector('#tecladoVirtual').setAttribute('visible', false);
        this.campoEditando = null;

        // Reverter o zoom da câmera
        this.cameraRig.setAttribute('position', '0 1.5 4');

    },
});
