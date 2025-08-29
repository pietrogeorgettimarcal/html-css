document.addEventListener('DOMContentLoaded', () => {
    // --- BANCO DE DADOS SIMULADO ---
    let funcionarios = [];
    let ferias = [];
    let feriados = [];

    // --- ELEMENTOS DO DOM ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mesSelect = document.getElementById('mes');
    const anoSelect = document.getElementById('ano');
    const containerPontos = document.getElementById('container-pontos');
    const formCadastro = document.getElementById('form-cadastro');
    const formFerias = document.getElementById('form-ferias');
    const funcionarioFeriasSelect = document.getElementById('funcionario-ferias');
    const anoFeriadoTitulo = document.getElementById('ano-feriado-titulo');
    
    // Botões de Ação
    const btnSalvar = document.getElementById('btn-salvar');
    const btnPdf = document.getElementById('btn-pdf');
    const btnExcel = document.getElementById('btn-excel');

    // Imagem do brasão em Base64 para evitar problemas de CORS no PDF
    const brasaoBase64 = "data:image/png;base64,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";

    // --- INICIALIZAÇÃO ---
    function init() {
        carregarDados();
        setupNavegacao();
        setupControlesData();
        const anoAtual = parseInt(anoSelect.value);
        inicializarFeriados(anoAtual);
        formCadastro.addEventListener('submit', cadastrarFuncionario);
        formFerias.addEventListener('submit', registrarFerias);
        mesSelect.addEventListener('change', renderizarTodasAsFolhas);
        anoSelect.addEventListener('change', () => {
            const novoAno = parseInt(anoSelect.value);
            inicializarFeriados(novoAno);
            renderizarTodasAsFolhas();
        });
        btnSalvar.addEventListener('click', salvarDados);
        btnPdf.addEventListener('click', baixarPDF);
        btnExcel.addEventListener('click', baixarExcel);
        renderizarTodasAsFolhas();
    }

    // --- PERSISTÊNCIA DE DADOS ---
    function salvarDados() {
        try {
            const dados = { funcionarios: funcionarios, ferias: ferias };
            localStorage.setItem('dadosPontoKyro', JSON.stringify(dados));
            alert('Dados salvos com sucesso no seu navegador!');
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            alert('Não foi possível salvar os dados.');
        }
    }

    function carregarDados() {
        const dadosSalvos = localStorage.getItem('dadosPontoKyro');
        if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            funcionarios = dados.funcionarios || [];
            ferias = (dados.ferias || []).map(f => ({ ...f, inicio: new Date(f.inicio), fim: new Date(f.fim) }));
        }
    }

    // --- FUNÇÕES DE EXPORTAÇÃO ---
    function baixarPDF() {
        if (funcionarios.length === 0) {
            alert("Não há folhas de ponto para exportar.");
            return;
        }

        const confirmacao = confirm(`Isso irá gerar ${funcionarios.length} arquivo(s) PDF, um para cada funcionário. Seu navegador pode pedir permissão para múltiplos downloads. Deseja continuar?`);
        if (!confirmacao) {
            return;
        }

        btnPdf.textContent = `Gerando 0/${funcionarios.length}...`;
        btnPdf.disabled = true;

        const folhas = document.querySelectorAll('.folha-ponto');
        const mesNome = mesSelect.options[mesSelect.selectedIndex].text;
        const ano = anoSelect.value;
        const promessasDeDownload = [];

        folhas.forEach((folha, index) => {
            const funcionario = funcionarios[index];
            const nomeArquivo = `Ponto_${funcionario.nome.replace(/ /g, '_')}_${mesNome}_${ano}.pdf`;

            // *** ALTERAÇÃO AQUI: Margem reduzida para ajudar a caber em uma página ***
            const opt = {
                margin: 0.3, 
                filename: nomeArquivo,
                image: { type: 'png', quality: 0.98 },
                html2canvas: {
                    scale: 1.5,
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            const promise = html2pdf().from(folha).set(opt).save()
                .then(() => {
                    btnPdf.textContent = `Gerando ${index + 1}/${funcionarios.length}...`;
                });
            
            promessasDeDownload.push(promise);
        });

        Promise.all(promessasDeDownload)
            .then(() => {
                console.log("Todos os PDFs foram gerados.");
                setTimeout(() => {
                    btnPdf.textContent = 'Baixar PDF';
                    btnPdf.disabled = false;
                }, 1000);
            })
            .catch(err => {
                console.error("Ocorreu um erro durante a geração de um ou mais PDFs:", err);
                alert("Ocorreu um erro durante a geração dos PDFs.");
                setTimeout(() => {
                    btnPdf.textContent = 'Baixar PDF';
                    btnPdf.disabled = false;
                }, 1000);
            });
    }

    function baixarExcel() {
        if (funcionarios.length === 0) {
            alert("Não há folhas de ponto para exportar.");
            return;
        }
        const wb = XLSX.utils.book_new();
        document.querySelectorAll('.folha-ponto').forEach((folha, index) => {
            const nomeFuncionario = funcionarios[index].nome.substring(0, 31);
            const tabela = folha.querySelector('.tabela-ponto');
            const ws = XLSX.utils.table_to_sheet(tabela);
            XLSX.utils.book_append_sheet(wb, ws, nomeFuncionario);
        });
        XLSX.writeFile(wb, "Folhas_de_Ponto.xlsx");
    }
    
    // O restante do código permanece o mesmo

    function setupNavegacao() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                pages.forEach(page => page.classList.remove('active'));
                navLinks.forEach(nav => nav.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
                link.classList.add('active');
                if (targetId === 'ferias') {
                    atualizarSelectFuncionarios();
                }
                if (targetId === 'feriados') {
                    anoFeriadoTitulo.textContent = anoSelect.value;
                    renderizarListaFeriados();
                }
            });
        });
    }

    function setupControlesData() {
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        meses.forEach((mes, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = mes;
            if (index === mesAtual) option.selected = true;
            mesSelect.appendChild(option);
        });
        for (let i = anoAtual - 5; i <= anoAtual + 5; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === anoAtual) option.selected = true;
            anoSelect.appendChild(option);
        }
    }

    function cadastrarFuncionario(e) {
        e.preventDefault();
        const novoFuncionario = { id: Date.now(), nome: document.getElementById('novo-nome').value, matricula: document.getElementById('nova-matricula').value };
        funcionarios.push(novoFuncionario);
        alert('Funcionário cadastrado com sucesso!');
        formCadastro.reset();
        renderizarTodasAsFolhas();
        document.querySelector('a[href="#ponto"]').click();
    }

    function registrarFerias(e) {
        e.preventDefault();
        const novasFerias = {
            funcionarioId: parseInt(funcionarioFeriasSelect.value),
            inicio: new Date(document.getElementById('ferias-inicio').value + 'T00:00:00'),
            fim: new Date(document.getElementById('ferias-fim').value + 'T23:59:59')
        };
        ferias.push(novasFerias);
        alert('Férias registradas com sucesso!');
        formFerias.reset();
        renderizarTodasAsFolhas();
        document.querySelector('a[href="#ponto"]').click();
    }
    
    function inicializarFeriados(ano) {
        feriados = [];
        function calcularPascoa(y) {
            const a = y % 19; const b = Math.floor(y / 100); const c = y % 100; const d = Math.floor(b / 4); const e = b % 4; const f = Math.floor((b + 8) / 25); const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30; const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7; const m = Math.floor((a + 11 * h + 22 * l) / 451); const month = Math.floor((h + l - 7 * m + 114) / 31); const day = ((h + l - 7 * m + 114) % 31) + 1;
            return new Date(y, month - 1, day);
        }
        const pascoa = calcularPascoa(ano);
        const formatarData = (d) => d.toISOString().split('T')[0];
        const addDays = (date, days) => { const result = new Date(date); result.setDate(result.getDate() + days); return result; };
        const feriadosBase = [
            { nome: "Confraternização Universal", data: formatarData(new Date(ano, 0, 1)) }, { nome: "Carnaval (Ponto Facultativo)", data: formatarData(addDays(pascoa, -48)) }, { nome: "Carnaval (Ponto Facultativo)", data: formatarData(addDays(pascoa, -47)) }, { nome: "Quarta-feira de Cinzas (Ponto Facultativo)", data: formatarData(addDays(pascoa, -46)) }, { nome: "Paixão de Cristo", data: formatarData(addDays(pascoa, -2)) }, { nome: "Tiradentes", data: formatarData(new Date(ano, 3, 21)) }, { nome: "Dia do Trabalho", data: formatarData(new Date(ano, 4, 1)) }, { nome: "Corpus Christi (Ponto Facultativo)", data: formatarData(addDays(pascoa, 60)) }, { nome: "Independência do Brasil", data: formatarData(new Date(ano, 8, 7)) }, { nome: "Nossa Senhora Aparecida", data: formatarData(new Date(ano, 9, 12)) }, { nome: "Finados", data: formatarData(new Date(ano, 10, 2)) }, { nome: "Proclamação da República", data: formatarData(new Date(ano, 10, 15)) }, { nome: "Dia da Consciência Negra", data: formatarData(new Date(ano, 10, 20)) }, { nome: "Natal", data: formatarData(new Date(ano, 11, 25)) },
        ];
        feriados = [...feriadosBase].sort((a, b) => new Date(a.data) - new Date(b.data));
        renderizarListaFeriados();
    }

    function renderizarListaFeriados() {
        const lista = document.getElementById('lista-feriados');
        if (feriados.length === 0) { lista.innerHTML = "<p>Nenhum feriado para o ano selecionado.</p>"; return; }
        lista.innerHTML = '<ul>' + feriados.map(f => {
            const dataFeriado = new Date(f.data + 'T00:00:00');
            const dataFormatada = dataFeriado.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            return `<li><strong>${dataFormatada}</strong> - ${f.nome}</li>`;
        }).join('') + '</ul>';
    }

    function atualizarSelectFuncionarios() {
        funcionarioFeriasSelect.innerHTML = '<option value="" disabled selected>Selecione um funcionário</option>';
        funcionarios.forEach(func => {
            const option = document.createElement('option');
            option.value = func.id;
            option.textContent = `${func.nome} (Mat. ${func.matricula})`;
            funcionarioFeriasSelect.appendChild(option);
        });
    }

    function renderizarTodasAsFolhas() {
        containerPontos.innerHTML = '';
        if (funcionarios.length === 0) {
            containerPontos.innerHTML = '<p style="text-align: center; font-style: italic;">Nenhum funcionário cadastrado. Adicione um na aba "Cadastrar Funcionário".</p>';
            return;
        }
        funcionarios.forEach(func => {
            const folhaHTML = criarFolhaDePonto(func);
            containerPontos.insertAdjacentHTML('beforeend', folhaHTML);
        });
    }

    function criarFolhaDePonto(funcionario) {
        const mes = parseInt(mesSelect.value); const ano = parseInt(anoSelect.value); const dataInicio = new Date(ano, mes, 11); const dataFim = new Date(ano, mes + 1, 10); const periodoStr = `${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')}`;
        let corpoTabela = ''; let dataCorrente = new Date(dataInicio);
        while (dataCorrente <= dataFim) {
            const dia = dataCorrente.getDate(); const diaSemana = dataCorrente.toLocaleDateString('pt-BR', { weekday: 'long' }); const diaSemanaNum = dataCorrente.getDay();
            let classeEspecial = ''; let textoEspecial = '';
            const emFerias = ferias.some(f => f.funcionarioId === funcionario.id && dataCorrente >= f.inicio && dataCorrente <= f.fim);
            const isFimDeSemana = diaSemanaNum === 0 || diaSemanaNum === 6;
            const isFeriado = feriados.some(f => f.data === formatarDataParaComparacao(dataCorrente));
            if (emFerias) { classeEspecial = 'ferias'; textoEspecial = 'FÉRIAS'; } else if (isFimDeSemana) { classeEspecial = 'folga'; textoEspecial = 'FOLGA'; } else if (isFeriado) { classeEspecial = 'feriado'; textoEspecial = 'FERIADO'; }
            let colunasPeriodo;
            if (textoEspecial) {
                colunasPeriodo = `<td class="evento-especial-texto">${textoEspecial}</td><td class="evento-especial-texto">${textoEspecial}</td><td class="evento-especial-texto">${textoEspecial}</td><td class="evento-especial-texto">${textoEspecial}</td>`;
            } else {
                colunasPeriodo = `<td></td><td></td><td></td><td></td>`;
            }
            corpoTabela += `<tr class="${classeEspecial}"><td>${dia}</td><td>${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}</td>${colunasPeriodo}<td></td></tr>`;
            dataCorrente.setDate(dataCorrente.getDate() + 1);
        }
        return `
            <div class="folha-ponto">
                <div class="cabecalho-ponto"><img src="${brasaoBase64}" alt="Brasão Prefeitura de Limeira"><div class="titulo-prefeitura">PREFEITURA MUNICIPAL DE LIMEIRA<br>SECRETARIA MUNICIPAL DE FAZENDA<br>DEPARTAMENTO EXECUÇÃO ORÇAMENTÁRIA</div></div>
                <h3 class="titulo-frequencia">FOLHA DE FREQUÊNCIA</h3>
                <div class="info-funcionario"><div><strong>Nome Completo:</strong> ${funcionario.nome}</div><div><strong>Matrícula:</strong> ${funcionario.matricula}</div><div><strong>Secretaria:</strong> FAZENDA</div><div><strong>Admissão:</strong> _________________________</div><div><strong>Função:</strong> _________________________</div></div>
                <div class="info-periodo">Período: ${periodoStr}</div>
                <table class="tabela-ponto">
                    <thead><tr><th rowspan="2">Dia</th><th rowspan="2">Dia da Semana</th><th colspan="2">1º Período</th><th colspan="2">2º Período</th><th rowspan="2">Assinatura</th></tr><tr><th>Entrada</th><th>Saída</th><th>Entrada</th><th>Saída</th></tr></thead>
                    <tbody>${corpoTabela}</tbody>
                </table>
                <div class="rodape-ponto">
                    <div class="resumo-horas"><div>Total de horas no período: ___________________</div><div>Nº horas/dia: 08</div><div>Total de horas a trabalhar: ___________________</div><div>Total de dias úteis/mês: ___________________</div></div>
                    <div class="assinaturas-ponto"><div class="assinatura-item"><div class="linha-assinatura"></div><div>Funcionário</div></div><div class="assinatura-item"><div class="linha-assinatura"></div><div>Responsável</div></div></div>
                </div>
            </div>`;
    }
    
    function formatarDataParaComparacao(date) {
        const yyyy = date.getFullYear(); const mm = String(date.getMonth() + 1).padStart(2, '0'); const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // Inicia a aplicação
    init();
});