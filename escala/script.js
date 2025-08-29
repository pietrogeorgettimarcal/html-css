document.addEventListener('DOMContentLoaded', () => {
    // Referências aos Elementos do DOM (sem alterações)
    const formFuncionario = document.getElementById('form-funcionario');
    const nomeInput = document.getElementById('nome');
    const matriculaInput = document.getElementById('matricula');
    const listaFuncionarios = document.getElementById('lista-funcionarios');
    const excluirFuncionarioBtn = document.getElementById('excluir-funcionario');
    const formSenha = document.getElementById('form-senha');
    const nomeSenhaInput = document.getElementById('nome-senha');
    const listaSenha = document.getElementById('lista-senha');
    const excluirSenhaBtn = document.getElementById('excluir-senha');
    const formFerias = document.getElementById('form-ferias');
    const nomeFeriasInput = document.getElementById('nome-ferias');
    const inicioFeriasInput = document.getElementById('inicio-ferias');
    const fimFeriasInput = document.getElementById('fim-ferias');
    const listaFerias = document.getElementById('lista-ferias');
    const excluirFeriasBtn = document.getElementById('excluir-ferias');
    const metaFixoGlobal = document.getElementById('meta-fixo-global');
    const maxSuplenteGlobal = document.getElementById('max-suplente-global');
    const totalGlobalDisplay = document.getElementById('total-global-display');
    const aplicarMetasGlobaisBtn = document.getElementById('aplicar-metas-globais-btn');
    const formMetas = document.getElementById('form-metas');
    const funcionarioMetaSelect = document.getElementById('funcionario-meta-select');
    const metaFixoInput = document.getElementById('meta-fixo');
    const maxSuplenteInput = document.getElementById('max-suplente');
    const totalIndividualDisplay = document.getElementById('total-individual-display');
    const listaMetas = document.getElementById('lista-metas');
    const excluirMetaBtn = document.getElementById('excluir-meta');
    const mesSelect = document.getElementById('mes-select');
    const anoInput = document.getElementById('ano-input');
    const gerarEscalaBtn = document.getElementById('gerar-escala-btn');
    const embaralharBtn = document.getElementById('embaralhar');
    const salvarBtn = document.getElementById('salvar');
    const baixarExcelBtn = document.getElementById('baixar-excel-btn');
    const baixarPdfBtn = document.getElementById('baixar-pdf-btn');
    const listaFeriados = document.getElementById('lista-feriados');
    const anoFeriadoSpan = document.getElementById('ano-feriado');
    const tituloEscala = document.getElementById('titulo-escala');
    const tabelaEscala = document.getElementById('tabela-escala');
    const tabelaResumo = document.getElementById('tabela-resumo');
    const resumoFeriasMes = document.getElementById('resumo-ferias-mes');

    // Estado da Aplicação (sem alterações)
    let state = {
        funcionarios: [],
        funcionariosSenha: [],
        ferias: [],
        metas: {},
        escalaGerada: [],
        resumoGerado: []
    };
    let selecionado = {
        funcionario: null,
        senha: null,
        ferias: null,
        meta: null
    };

    // --- FUNÇÕES DE PERSISTÊNCIA (localStorage) --- (sem alterações)
    function salvarDados() {
        localStorage.setItem('escalaKyro', JSON.stringify(state));
        alert('Dados salvos com sucesso!');
    }
    function carregarDados() {
        const dados = localStorage.getItem('escalaKyro');
        if (dados) {
            state = JSON.parse(dados);
        }
    }
    
    // --- FUNÇÕES DE RENDERIZAÇÃO --- (sem alterações)
    const renderAll = () => {
        renderFuncionarios();
        renderSenha();
        renderFerias();
        renderMetas();
        updateMetasSelect();
        renderFeriados(new Date().getFullYear());
    };
    const renderFuncionarios = () => {
        listaFuncionarios.innerHTML = '';
        state.funcionarios.forEach((func, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${func.nome}</td><td>${func.matricula}</td>`;
            tr.dataset.index = index;
            tr.addEventListener('click', () => {
                selecionado.funcionario = { index, ...func };
                updateSelecao(listaFuncionarios, tr);
            });
            listaFuncionarios.appendChild(tr);
        });
    };
    const renderSenha = () => {
        listaSenha.innerHTML = '';
        state.funcionariosSenha.forEach((func, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${func.nome}</td>`;
            tr.dataset.index = index;
            tr.addEventListener('click', () => {
                selecionado.senha = { index, ...func };
                updateSelecao(listaSenha, tr);
            });
            listaSenha.appendChild(tr);
        });
    };
    const renderFerias = () => {
        listaFerias.innerHTML = '';
        state.ferias.forEach((f, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${f.nome}</td><td>${f.inicio}</td><td>${f.fim}</td>`;
            tr.dataset.index = index;
            tr.addEventListener('click', () => {
                selecionado.ferias = { index, ...f };
                updateSelecao(listaFerias, tr);
            });
            listaFerias.appendChild(tr);
        });
    };
    const renderMetas = () => {
        listaMetas.innerHTML = '';
        state.funcionarios.forEach(func => {
            if (!state.funcionariosSenha.some(s => s.nome === func.nome)) {
                const meta = state.metas[func.nome] || { fixo: 0, suplente: 0 };
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${func.nome}</td>
                    <td>${meta.fixo}</td>
                    <td>${meta.suplente}</td>
                    <td>${meta.fixo + meta.suplente}</td>
                `;
                tr.dataset.nome = func.nome;
                tr.addEventListener('click', () => {
                    selecionado.meta = { nome: func.nome };
                    updateSelecao(listaMetas, tr);
                    funcionarioMetaSelect.value = func.nome;
                    metaFixoInput.value = meta.fixo;
                    maxSuplenteInput.value = meta.suplente;
                    updateTotalDisplay(totalIndividualDisplay, meta.fixo, meta.suplente);
                });
                listaMetas.appendChild(tr);
            }
        });
    };
    function updateMetasSelect() {
        funcionarioMetaSelect.innerHTML = '<option value="">Selecione um funcionário</option>';
        state.funcionarios
            .filter(f => !state.funcionariosSenha.some(s => s.nome === f.nome))
            .forEach(func => {
                const option = document.createElement('option');
                option.value = func.nome;
                option.textContent = func.nome;
                funcionarioMetaSelect.appendChild(option);
            });
    }
    function updateSelecao(tbody, selectedTr) {
        tbody.querySelectorAll('tr').forEach(row => row.classList.remove('selecionado'));
        selectedTr.classList.add('selecionado');
    }

    // --- LÓGICA DE FERIADOS --- (sem alterações)
    function getFeriados(ano) {
        const a = ano % 19; const b = Math.floor(ano / 100); const c = ano % 100; const d = Math.floor(b / 4); const e = b % 4; const f = Math.floor((b + 8) / 25); const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30; const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7; const m = Math.floor((a + 11 * h + 22 * l) / 451); const mes = Math.floor((h + l - 7 * m + 114) / 31); const dia = ((h + l - 7 * m + 114) % 31) + 1; const pascoa = new Date(ano, mes - 1, dia); const umDia = 24 * 60 * 60 * 1000;
        const feriados = [
            { data: new Date(ano, 0, 1), nome: "Confraternização Universal" }, { data: new Date(ano, 3, 21), nome: "Tiradentes" }, { data: new Date(ano, 4, 1), nome: "Dia do Trabalho" }, { data: new Date(ano, 8, 7), nome: "Independência do Brasil" }, { data: new Date(ano, 9, 12), nome: "Nossa Senhora Aparecida" }, { data: new Date(ano, 10, 2), nome: "Finados" }, { data: new Date(ano, 10, 15), nome: "Proclamação da República" }, { data: new Date(ano, 10, 20), nome: "Dia da Consciência Negra" }, { data: new Date(ano, 11, 25), nome: "Natal" },
            { data: new Date(pascoa.getTime() - 2 * umDia), nome: "Sexta-feira Santa" }, { data: pascoa, nome: "Páscoa" },
            { data: new Date(pascoa.getTime() - 48 * umDia), nome: "Carnaval (segunda-feira)" }, { data: new Date(pascoa.getTime() - 47 * umDia), nome: "Carnaval (terça-feira)" }, { data: new Date(pascoa.getTime() + 60 * umDia), nome: "Corpus Christi" }, { data: new Date(ano, 11, 24), nome: "Véspera de Natal" }, { data: new Date(ano, 11, 31), nome: "Véspera de Ano Novo" }
        ];
        return feriados.sort((a, b) => a.data - b.data);
    }
    function renderFeriados(ano) {
        listaFeriados.innerHTML = ''; anoFeriadoSpan.textContent = ano; const feriados = getFeriados(ano);
        feriados.forEach(f => {
            const tr = document.createElement('tr'); const dataFormatada = f.data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }); const diaSemana = f.data.toLocaleDateString('pt-BR', { weekday: 'long' });
            tr.innerHTML = `<td>${dataFormatada} (${diaSemana})</td><td>${f.nome}</td>`;
            listaFeriados.appendChild(tr);
        });
    }

    // --- EVENT LISTENERS --- (sem alterações)
    formFuncionario.addEventListener('submit', (e) => { e.preventDefault(); state.funcionarios.push({ nome: nomeInput.value, matricula: matriculaInput.value }); formFuncionario.reset(); renderAll(); });
    excluirFuncionarioBtn.addEventListener('click', () => { if (selecionado.funcionario !== null) { const nome = state.funcionarios[selecionado.funcionario.index].nome; state.funcionariosSenha = state.funcionariosSenha.filter(f => f.nome !== nome); state.ferias = state.ferias.filter(f => f.nome !== nome); delete state.metas[nome]; state.funcionarios.splice(selecionado.funcionario.index, 1); selecionado.funcionario = null; renderAll(); } else { alert('Selecione um funcionário para excluir.'); } });
    formSenha.addEventListener('submit', e => { e.preventDefault(); state.funcionariosSenha.push({ nome: nomeSenhaInput.value }); formSenha.reset(); renderAll(); });
    excluirSenhaBtn.addEventListener('click', () => { if (selecionado.senha !== null) { state.funcionariosSenha.splice(selecionado.senha.index, 1); selecionado.senha = null; renderAll(); } else { alert('Selecione um funcionário da senha para excluir.'); } });
    formFerias.addEventListener('submit', e => { e.preventDefault(); state.ferias.push({ nome: nomeFeriasInput.value, inicio: inicioFeriasInput.value, fim: fimFeriasInput.value }); formFerias.reset(); renderFerias(); });
    excluirFeriasBtn.addEventListener('click', () => { if (selecionado.ferias !== null) { state.ferias.splice(selecionado.ferias.index, 1); selecionado.ferias = null; renderFerias(); } else { alert('Selecione um registro de férias para excluir.'); } });
    const updateTotalDisplay = (el, fixo, supl) => { el.textContent = (parseInt(fixo) || 0) + (parseInt(supl) || 0); };
    metaFixoGlobal.addEventListener('input', () => updateTotalDisplay(totalGlobalDisplay, metaFixoGlobal.value, maxSuplenteGlobal.value));
    maxSuplenteGlobal.addEventListener('input', () => updateTotalDisplay(totalGlobalDisplay, metaFixoGlobal.value, maxSuplenteGlobal.value));
    metaFixoInput.addEventListener('input', () => updateTotalDisplay(totalIndividualDisplay, metaFixoInput.value, maxSuplenteInput.value));
    maxSuplenteInput.addEventListener('input', () => updateTotalDisplay(totalIndividualDisplay, metaFixoInput.value, maxSuplenteInput.value));
    aplicarMetasGlobaisBtn.addEventListener('click', () => { const metaFixo = parseInt(metaFixoGlobal.value) || 0; const maxSuplente = parseInt(maxSuplenteGlobal.value) || 0; state.funcionarios.forEach(func => { if (!state.funcionariosSenha.some(s => s.nome === func.nome)) { state.metas[func.nome] = { fixo: metaFixo, suplente: maxSuplente }; } }); renderMetas(); });
    formMetas.addEventListener('submit', (e) => { e.preventDefault(); const nome = funcionarioMetaSelect.value; if (nome) { state.metas[nome] = { fixo: parseInt(metaFixoInput.value) || 0, suplente: parseInt(maxSuplenteInput.value) || 0 }; renderMetas(); formMetas.reset(); updateTotalDisplay(totalIndividualDisplay, 0, 0); } else { alert('Selecione um funcionário.'); } });
    excluirMetaBtn.addEventListener('click', () => { if (selecionado.meta) { delete state.metas[selecionado.meta.nome]; selecionado.meta = null; renderMetas(); } else { alert('Selecione uma meta na tabela para excluir.'); } });
    salvarBtn.addEventListener('click', salvarDados);
    gerarEscalaBtn.addEventListener('click', () => gerarEscala(false));
    embaralharBtn.addEventListener('click', () => gerarEscala(true));
    anoInput.addEventListener('change', () => renderFeriados(parseInt(anoInput.value)));
    baixarExcelBtn.addEventListener('click', baixarExcel);
    baixarPdfBtn.addEventListener('click', baixarPDF);
    
    // --- LÓGICA PRINCIPAL DA ESCALA --- (sem alterações)
    function gerarEscala(embaralhar) {
        const mes = parseInt(mesSelect.value); const ano = parseInt(anoInput.value); const diasNoMes = new Date(ano, mes + 1, 0).getDate(); const nomeMes = new Date(ano, mes).toLocaleString('pt-BR', { month: 'long' });
        tituloEscala.textContent = `Escala do Guichê para ${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} de ${ano}`;
        const feriados = getFeriados(ano).map(f => f.data.toDateString()); const diasUteis = [];
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const data = new Date(ano, mes, dia); const diaSemana = data.getDay();
            if (diaSemana !== 0 && diaSemana !== 6 && !feriados.includes(data.toDateString())) { diasUteis.push(data); }
        }
        let poolGeral = state.funcionarios.filter(f => !state.funcionariosSenha.some(s => s.nome === f.nome));
        if (embaralhar) { poolGeral = poolGeral.sort(() => Math.random() - 0.5); }
        const contagem = {}; poolGeral.forEach(f => { contagem[f.nome] = { fixo: 0, suplente: 0 }; });
        const escala = []; let senhaIndex = 0; let diasComMesmaSenha = 0; let fixosDiaAnterior = new Set(); const poolSenha = [...state.funcionariosSenha];
        diasUteis.forEach(data => {
            const linha = { data: data, diaSemana: data, senha: '', fixo1: '', fixo2: '', sup1: '', sup2: '', sup3: '', sup4: '', sup5: '' };
            if (poolSenha.length > 0) {
                linha.senha = poolSenha[senhaIndex].nome; diasComMesmaSenha++;
                if (diasComMesmaSenha >= 3) { senhaIndex = (senhaIndex + 1) % poolSenha.length; diasComMesmaSenha = 0; }
            }
            let disponiveisHoje = poolGeral.filter(f => !estaDeFerias(f.nome, data)).sort(() => Math.random() - 0.5); const escaladosHoje = new Set();
            const candidatosFixo = [...disponiveisHoje].sort((a, b) => {
                const metaA = state.metas[a.nome] || { fixo: 0 }; const metaB = state.metas[b.nome] || { fixo: 0 }; const feriasA = entraEmFeriasEmBreve(a.nome, data); const feriasB = entraEmFeriasEmBreve(b.nome, data);
                if (feriasA && contagem[a.nome].fixo < metaA.fixo && !feriasB) return -1; if (feriasB && contagem[b.nome].fixo < metaB.fixo && !feriasA) return 1;
                if ((contagem[a.nome].fixo / (metaA.fixo || 1)) < (contagem[b.nome].fixo / (metaB.fixo || 1))) return -1; if ((contagem[a.nome].fixo / (metaA.fixo || 1)) > (contagem[b.nome].fixo / (metaB.fixo || 1))) return 1;
                return 0;
            });
            const candidatosFixoHoje = candidatosFixo.filter(f => !fixosDiaAnterior.has(f.nome));
            const fixo1 = candidatosFixoHoje.find(f => !escaladosHoje.has(f.nome)); if (fixo1) { linha.fixo1 = fixo1.nome; escaladosHoje.add(fixo1.nome); contagem[fixo1.nome].fixo++; }
            const fixo2 = candidatosFixoHoje.find(f => !escaladosHoje.has(f.nome)); if (fixo2) { linha.fixo2 = fixo2.nome; escaladosHoje.add(fixo2.nome); contagem[fixo2.nome].fixo++; }
            const candidatosSuplente = disponiveisHoje.filter(f => !escaladosHoje.has(f.nome)).sort((a,b) => (contagem[a.nome].suplente - contagem[b.nome].suplente));
            for(let i=1; i<=5; i++) {
                if(candidatosSuplente.length > (i-1)) { const sup = candidatosSuplente[i-1]; linha[`sup${i}`] = sup.nome; escaladosHoje.add(sup.nome); contagem[sup.nome].suplente++; } else { linha.incompleta = true; }
            }
            escala.push(linha); fixosDiaAnterior.clear(); if (linha.fixo1) fixosDiaAnterior.add(linha.fixo1); if (linha.fixo2) fixosDiaAnterior.add(linha.fixo2);
        });
        state.escalaGerada = escala; renderEscala(escala); renderResumo(contagem); renderResumoFerias(mes, ano);
    }
    
    // --- FUNÇÕES AUXILIARES E DE RENDERIZAÇÃO --- (sem alterações)
    const estaDeFerias = (nome, data) => state.ferias.some(f => (f.nome === nome && data >= new Date(f.inicio + 'T00:00:00') && data <= new Date(f.fim + 'T23:59:59')));
    const entraEmFeriasEmBreve = (nome, data) => state.ferias.some(f => (f.nome === nome && new Date(f.inicio + 'T00:00:00').getMonth() === data.getMonth() && new Date(f.inicio + 'T00:00:00') > data));
    function renderEscala(escala) {
        tabelaEscala.innerHTML = ''; escala.forEach(linha => {
            const tr = document.createElement('tr'); if (linha.incompleta) tr.classList.add('escala-incompleta');
            tr.innerHTML = `<td>${linha.data.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}</td><td>${linha.diaSemana.toLocaleDateString('pt-BR', {weekday:'long'})}</td><td>${linha.senha||'---'}</td><td>${linha.fixo1||'FALTA'}</td><td>${linha.fixo2||'FALTA'}</td><td>${linha.sup1||'---'}</td><td>${linha.sup2||'---'}</td><td>${linha.sup3||'---'}</td><td>${linha.sup4||'---'}</td><td>${linha.sup5||'---'}</td>`;
            tabelaEscala.appendChild(tr);
        });
    }
    function renderResumo(contagem) {
        tabelaResumo.innerHTML = ''; state.resumoGerado = []; const funcionariosGerais = state.funcionarios.filter(f => !state.funcionariosSenha.some(s => s.nome === f.nome));
        funcionariosGerais.forEach(func => {
            const nome = func.nome; const c = contagem[nome] || { fixo: 0, suplente: 0 }; const total = c.fixo + c.suplente;
            const tr = document.createElement('tr'); tr.innerHTML = `<td>${nome}</td><td>${c.fixo}</td><td>${c.suplente}</td><td>${total}</td>`;
            tabelaResumo.appendChild(tr); state.resumoGerado.push({ funcionario: nome, fixo: c.fixo, suplente: c.suplente, total: total });
        });
    }
    function renderResumoFerias(mes, ano) {
        resumoFeriasMes.innerHTML = ''; const feriasNoMes = getFeriasNoMes(mes, ano);
        if (feriasNoMes.length > 0) {
            let html = '<strong>Funcionários de férias neste mês:</strong><br>';
            feriasNoMes.forEach(f => { html += `${f.nome} (de ${new Date(f.inicio+'T00:00:00').toLocaleDateString('pt-BR')} a ${new Date(f.fim+'T00:00:00').toLocaleDateString('pt-BR')}) <br>`; });
            resumoFeriasMes.innerHTML = html;
        }
    }
    function getFeriasNoMesString(mes, ano, comTitulo = true) {
        const feriasNoMes = getFeriasNoMes(mes, ano); if (feriasNoMes.length === 0) return "";
        let texto = comTitulo ? "FÉRIAS\n" : "";
        feriasNoMes.forEach(f => {
            const inicioF = new Date(f.inicio + 'T00:00:00').toLocaleDateString('pt-BR'); const fimF = new Date(f.fim + 'T00:00:00').toLocaleDateString('pt-BR');
            texto += `${f.nome}: ${inicioF} a ${fimF}\n`;
        }); return texto;
    }
    function getFeriasNoMes(mes, ano) {
        return state.ferias.filter(f => {
            const inicio = new Date(f.inicio); const fim = new Date(f.fim);
            return inicio.getMonth() === mes || fim.getMonth() === mes || (inicio < new Date(ano, mes, 1) && fim > new Date(ano, mes, 1));
        });
    }
    
    // --- FUNÇÕES DE EXPORTAÇÃO --- (ATUALIZADAS COM FORMATAÇÃO AVANÇADA)
    function baixarExcel() {
        if (state.escalaGerada.length === 0) { alert("Gere uma escala antes de baixar."); return; }
        const mes = parseInt(mesSelect.value);
        const ano = parseInt(anoInput.value);
        const nomeMes = mesSelect.options[mesSelect.selectedIndex].text.toUpperCase();

        const wb = XLSX.utils.book_new();
        const ws_name = "Escala Mensal";
        
        // Estilos
        const centerStyle = { 
            alignment: { horizontal: "center", vertical: "center", wrapText: true },
            border: { top: {style:"thin"}, bottom: {style:"thin"}, left: {style:"thin"}, right: {style:"thin"} }
        };
        const titleStyle = { 
            alignment: { horizontal: "center", vertical: "center" },
            font: { sz: "14", bold: true }
        };

        // Conteúdo
        const headerText1 = "15 SENHAS OU 20\nMIN\nE ALMOÇO";
        const headerText2 = "ACIMA 20\nMINUTOS,\nALMOÇO";
        const headerText3 = "SE PRECISAR";
        const aoa = [
            [],
            [`ESCALA DO GUICHÊ PARA ${nomeMes} DE ${ano}`],
            [null, null, null, null, null, headerText1, headerText1, headerText1, headerText2, headerText3],
            ['Dia', 'Dia da Semana', 'Senha', 'Fixo 1', 'Fixo 2', '1° Suplente', '2° Suplente', '3° Suplente', '4° Suplente', '5° Suplente']
        ];
        
        const diasSemanaMap = { "domingo": "Domingo", "segunda-feira": "Segunda", "terça-feira": "Terça", "quarta-feira": "Quarta", "quinta-feira": "Quinta", "sexta-feira": "Sexta", "sábado": "Sábado" };
        state.escalaGerada.forEach(l => {
            const diaFormatado = String(l.data.getDate()).padStart(2, '0');
            const diaSemanaCompleto = l.diaSemana.toLocaleDateString('pt-BR', { weekday: 'long' });
            const diaSemanaAbreviado = diasSemanaMap[diaSemanaCompleto] || diaSemanaCompleto;
            aoa.push([diaFormatado, diaSemanaAbreviado, l.senha, l.fixo1, l.fixo2, l.sup1, l.sup2, l.sup3, l.sup4, l.sup5]);
        });
        
        // Adiciona Resumo e Férias ao lado
        aoa[2][11] = 'Nome'; aoa[2][12] = 'Fixo'; aoa[2][13] = 'Suplente'; aoa[2][14] = 'Total';
        state.resumoGerado.forEach((r, i) => {
            const row = aoa[3 + i] || [];
            row[11] = r.funcionario; row[12] = r.fixo; row[13] = r.suplente; row[14] = r.total;
            aoa[3 + i] = row;
        });
        const feriasStr = getFeriasNoMesString(mes, ano, true);
        if (feriasStr) {
            const feriasLinhas = feriasStr.split('\n').filter(Boolean);
            let startRow = 3 + state.resumoGerado.length + 2; // Pula 2 linhas
            feriasLinhas.forEach((linha, index) => {
                const row = aoa[startRow + index] || [];
                row[11] = linha;
                aoa[startRow + index] = row;
            });
        }
        
        const ws = XLSX.utils.aoa_to_sheet(aoa, {cellStyles: true});
        
        const range = XLSX.utils.decode_range(ws['!ref']);
        for(let R = 1; R <= range.e.r; ++R) { // Começa da linha 1 para pular a primeira linha vazia
            for(let C = 0; C <= range.e.c; ++C) {
                const cell_ref = XLSX.utils.encode_cell({c:C, r:R});
                if(!ws[cell_ref]) continue;
                if(R === 1) { // Linha do Título
                    ws[cell_ref].s = titleStyle;
                } else if (R >= 2) { // Restante da tabela
                     ws[cell_ref].s = centerStyle;
                }
            }
        }
        
        ws['!merges'] = [{ s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }];
        
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        XLSX.writeFile(wb, `Escala_Guiche_${nomeMes}_${ano}.xlsx`);
    }

    function baixarPDF() {
        if (state.escalaGerada.length === 0) { alert("Gere uma escala antes de baixar."); return; }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const mes = parseInt(mesSelect.value);
        const ano = parseInt(anoInput.value);
        const nomeMes = mesSelect.options[mesSelect.selectedIndex].text.toUpperCase();
        
        doc.setFontSize(14).setFont(undefined, 'bold');
        doc.text(`ESCALA DO GUICHÊ PARA ${nomeMes} DE ${ano}`, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

        const headerText1 = "15 SENHAS OU 20\nMIN\nE ALMOÇO";
        const headerText2 = "ACIMA 20\nMINUTOS,\nALMOÇO";
        const headerText3 = "SE PRECISAR";

        const headEscala = [
            ['', '', '', '', '', headerText1, headerText1, headerText1, headerText2, headerText3],
            ['Dia', 'Dia da Semana', 'Senha', 'Fixo 1', 'Fixo 2', '1° Suplente', '2° Suplente', '3° Suplente', '4° Suplente', '5° Suplente']
        ];
        
        const diasSemanaMap = { "domingo": "Domingo", "segunda-feira": "Segunda", "terça-feira": "Terça", "quarta-feira": "Quarta", "quinta-feira": "Quinta", "sexta-feira": "Sexta", "sábado": "Sábado" };
        const bodyEscala = state.escalaGerada.map(l => {
            const diaFormatado = String(l.data.getDate()).padStart(2, '0');
            const diaSemanaCompleto = l.diaSemana.toLocaleDateString('pt-BR', { weekday: 'long' });
            const diaSemanaAbreviado = diasSemanaMap[diaSemanaCompleto] || diaSemanaCompleto;
            return [diaFormatado, diaSemanaAbreviado, l.senha, l.fixo1, l.fixo2, l.sup1, l.sup2, l.sup3, l.sup4, l.sup5]
        });
        
        doc.autoTable({
            head: headEscala,
            body: bodyEscala,
            startY: 20,
            theme: 'grid',
            tableWidth: 195,
            margin: { left: 14 },
            styles: { fontSize: 7, halign: 'center', valign: 'middle', cellPadding: 1 },
            headStyles: { fillColor: [70, 70, 70], textColor: 255, fontSize: 5.5, lineWidth: 0.1, fontStyle: 'bold' },
            columnStyles: {
                 0: { cellWidth: 10 }, 1: { cellWidth: 20 }, 2: { cellWidth: 'auto' }, 3: { cellWidth: 'auto' }, 4: { cellWidth: 'auto' }, 5: { cellWidth: 'auto' }, 6: { cellWidth: 'auto' }, 7: { cellWidth: 'auto' }, 8: { cellWidth: 'auto' }, 9: { cellWidth: 'auto' }
            }
        });

        const bodyResumo = state.resumoGerado.map(r => [r.funcionario, r.fixo, r.suplente, r.total]);
        doc.autoTable({
            head: [['Nome', 'Fixo', 'Suplente', 'Total']],
            body: bodyResumo,
            startY: 20,
            theme: 'grid',
            tableWidth: 80,
            margin: { left: 212 },
            styles: { fontSize: 7, halign: 'center', valign: 'middle', cellPadding: 1 },
            headStyles: { fillColor: [70, 70, 70], textColor: 255, fontSize: 8, fontStyle: 'bold'},
        });
        
        const finalYResumo = doc.lastAutoTable.finalY;
        const feriasStr = getFeriasNoMesString(mes, ano, true);
        if (feriasStr) {
            doc.setFontSize(8).setFont(undefined, 'bold');
            // ATENÇÃO: a biblioteca jspdf-autotable pode não quebrar a linha automaticamente no doc.text
            // Por isso, separamos as linhas manualmente.
            const feriasLinhas = feriasStr.split('\n');
            let startY = finalYResumo + 5;
            feriasLinhas.forEach(linha => {
                doc.text(linha, 212, startY);
                startY += 4; // Incrementa a posição Y para a próxima linha
            });
        }
        
        doc.save(`Escala_Guiche_${nomeMes}_${ano}.pdf`);
    }

    // --- INICIALIZAÇÃO ---
    function init() {
        carregarDados();
        const hoje = new Date();
        mesSelect.value = hoje.getMonth();
        anoInput.value = hoje.getFullYear();
        renderAll();
    }
    init();
});