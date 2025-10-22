import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VarContext } from '../Context/VarContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRankingStar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import './Dashboard.css';
import * as Img from '../Components/Imagenes'
import Nav from '../Components/Nav'

const Dashboard = () => {
	const GConText = useContext(VarContext);
	const [avatar, setAvatar] = useState(0);

	// Agregar esta línea junto con los otros useState
	const [isTransitioning, setIsTransitioning] = useState(false);

	const [quizStep, setQuizStep] = useState('dashboard'); // dashboard, part1-intro, part1-quiz, part2-intro, part2-quiz, results, history
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState([]);
	const [part2Answers, setPart2Answers] = useState({});

	//PARTE1
	const quizQuestions = [
		{ q: "1️⃣ Estrategia y enfoque de aprendizaje: ¿Cuál describe mejor la forma en que se gestiona la capacitación en tu organización?", a: [{ text: "Se enfoca en cumplir con requisitos o plan anual; los cursos se comunican por correo o listas.", level: "Digitación" }, { text: "Usamos un LMS para administrar cursos, pero el objetivo principal sigue siendo la asistencia o certificación.", level: "Digitalización" }, { text: "Tenemos un enfoque basado en datos y competencias; medimos el progreso y buscamos impacto.", level: "Transformación Digital" }, { text: "La capacitación está integrada al negocio; el aprendizaje es continuo y ocurre dentro del flujo de trabajo con soporte IA.", level: "Beyond Digital" }] },
		{ q: "2️⃣ Contenido y experiencia de aprendizaje: ¿Cómo se desarrolla y entrega el contenido de formación?", a: [{ text: "Los contenidos son estáticos (PDFs, presentaciones, videos grabados).", level: "Digitación" }, { text: "Tenemos cursos en línea interactivos o microlearnings, con algunas evaluaciones.", level: "Digitalización" }, { text: "Usamos simulaciones, rutas de aprendizaje y experiencias inmersivas.", level: "Transformación Digital" }, { text: "Aplicamos IA o analítica para adaptar el contenido al perfil, desempeño o comportamiento del usuario.", level: "Beyond Digital" }] },
		{ q: "3️⃣ Práctica y transferencia al puesto: ¿Qué tanto se fomenta la práctica de habilidades en entornos reales o simulados?", a: [{ text: "La práctica se deja al colaborador; no hay seguimiento formal.", level: "Digitación" }, { text: "Hay ejercicios o quizzes, pero no simulaciones ni aplicación práctica.", level: "Digitalización" }, { text: "Tenemos roleplays o proyectos aplicados con acompañamiento.", level: "Transformación Digital" }, { text: "Contamos con IA o entornos virtuales que dan feedback inmediato y personalizado.", level: "Beyond Digital" }] },
		{ q: "4️⃣ Medición e impacto: ¿Cómo miden el éxito de la capacitación en tu organización?", a: [{ text: "Medimos asistencia o satisfacción.", level: "Digitación" }, { text: "Medimos finalización y resultados de evaluación.", level: "Digitalización" }, { text: "Medimos cambios en desempeño o habilidades observables.", level: "Transformación Digital" }, { text: "Correlacionamos datos de aprendizaje con resultados de negocio en tiempo real.", level: "Beyond Digital" }] },
		{ q: "5️⃣ Cultura y liderazgo digital: ¿Qué tan comprometidos están los líderes y sponsors con la transformación digital del aprendizaje?", a: [{ text: "Consideran la capacitación un requisito, no una ventaja competitiva.", level: "Digitación" }, { text: "La apoyan, pero con enfoque en cumplimiento y eficiencia.", level: "Digitalización" }, { text: "Promueven innovación, aprendizaje adaptativo y experimentación.", level: "Transformación Digital" }, { text: "Ven la IA y la analítica como palancas estratégicas de crecimiento y cultura.", level: "Beyond Digital" }] }
	];

	const maturityInsights = {
		'Digitación': "Tu organización se encuentra en una etapa inicial. Los contenidos aún son estáticos y el enfoque está en cumplir planes o asistencia.<br><br>💡 <strong>Primer paso sugerido:</strong><br>migrar a plataformas que te permitan automatizar seguimiento y capturar datos de participación.",
		'Digitalización': "Estás en una fase de transición hacia la transformación digital. Ya usas LMS o contenidos interactivos, pero falta conectar la experiencia con resultados y práctica real.<br><br>💡 <strong>Primer paso sugerido:</strong><br>incorporar herramientas de práctica o dashboards básicos para medir transferencia.",
		'Transformación Digital': "Tu empresa ya impulsa la capacitación basada en datos y resultados.<br><br>💡 <strong>Próximo paso:</strong><br>integrar IA para personalizar experiencias y retroalimentación en tiempo real.",
		'Beyond Digital': "Tu organización es un referente en aprendizaje inteligente y adaptativo.<br><br>💡 <strong>Reto actual:</strong><br>escalar la personalización e integrar IA predictiva en todo el ciclo de desarrollo y desempeño."
	};


	const maturityStages = {
		'Digitación': 'Contenidos estáticos distribuidos manualmente. La medición se limita a la asistencia.',
		'Digitalización': 'Uso de plataformas LMS/LXP para administrar y dar seguimiento. El enfoque está en la finalización.',
		'Transformación Digital': 'Experiencias de aprendizaje personalizadas basadas en datos, con práctica en simuladores.',
		'Beyond Digital': 'Aprendizaje integrado en el flujo de trabajo, adaptativo, predictivo y ligado a resultados de negocio.'
	};

	//PARTE2
	const opportunityQuestions = {
		'Escalabilidad y Personalización': {
			breachInsight: "Tu mayor oportunidad está en crear rutas de aprendizaje adaptativas por rol o nivel, donde la IA te ayude a automatizar personalización y ahorrar tiempo en la gestión.",
			questions: [
				{ q: "¿Tus programas de capacitación se adaptan automáticamente al rol, nivel o necesidades del colaborador?", a: [{ text: "Sí, usamos rutas o itinerarios personalizados.", score: 2 }, { text: "Parcialmente, adaptamos manualmente según el perfil.", score: 1 }, { text: "No, todos los colaboradores reciben el mismo contenido.", score: 0 }] },
				{ q: "¿Qué tanto puedes escalar la capacitación manteniendo calidad y relevancia?", a: [{ text: "Totalmente, el sistema ajusta contenido.", score: 2 }, { text: "Solo con gran esfuerzo manual.", score: 1 }, { text: "No podemos mantener personalización al escalar.", score: 0 }] }
			]
		},
		'Práctica y Feedback': {
			breachInsight: "El siguiente paso ideal es incorporar micro-simulaciones o roleplays con feedback IA, que fortalezcan la transferencia del aprendizaje sin requerir más facilitadores.",
			questions: [
				{ q: "¿Tus colaboradores practican habilidades críticas en entornos simulados o realistas?", a: [{ text: "Sí, tenemos simuladores o ejercicios aplicados.", score: 2 }, { text: "A veces, en sesiones presenciales.", score: 1 }, { text: "No, la práctica ocurre fuera del entrenamiento o no se mide.", score: 0 }] },
				{ q: "¿Reciben retroalimentación inmediata y específica sobre su desempeño?", a: [{ text: "Sí, en tiempo real (automática o humana).", score: 2 }, { text: "Solo al final del curso.", score: 1 }, { text: "No, rara vez reciben feedback.", score: 0 }] }
			]
		},
		'Medición e Impacto': {
			breachInsight: "Tu prioridad está en avanzar hacia dashboards de correlación entre aprendizaje y desempeño, integrando IA para identificar patrones de mejora.",
			questions: [
				{ q: "¿Puedes correlacionar los resultados de capacitación con indicadores de negocio (ventas, rotación, productividad)?", a: [{ text: "Sí, tenemos dashboards de impacto.", score: 2 }, { text: "Solo medimos satisfacción o asistencia.", score: 1 }, { text: "No tenemos medición de impacto aún.", score: 0 }] },
				{ q: "¿Qué tanto usas datos para ajustar los programas en tiempo real?", a: [{ text: "Siempre, cada entrega nos da métricas.", score: 2 }, { text: "De forma esporádica o manual.", score: 1 }, { text: "No contamos con información para hacerlo.", score: 0 }] }
			]
		},
		'Engagement y Experiencia': {
			breachInsight: "Tu oportunidad está en gamificar y narrativizar la experiencia: usar IA para personalizar retos, misiones y recompensas que incrementen motivación y permanencia.",
			questions: [
				{ q: "¿Qué tan atractivas y memorables son las experiencias de capacitación para tus colaboradores?", a: [{ text: "Altamente interactivas y gamificadas.", score: 2 }, { text: "Algunas tienen dinámicas o retos.", score: 1 }, { text: "La mayoría son expositivas y lineales.", score: 0 }] },
				{ q: "¿Tus programas adaptan la experiencia según participación o progreso del usuario?", a: [{ text: "Sí, el sistema ajusta dinámicas automáticamente.", score: 2 }, { text: "Solo enviamos recordatorios o feedback final.", score: 1 }, { text: "No, la experiencia es igual para todos.", score: 0 }] }
			]
		}
	};


	const actionableRecommendations = {
		'Escalabilidad y Personalización': { rec: "Diseña un piloto de rutas adaptativas IA que ajusten contenido y dificultad según rol.", ex: "Ej. Programa para líderes de tienda vs. supervisores con itinerarios IA personalizados." },
		'Práctica y Feedback': { rec: "Implementa roleplays o simuladores con feedback automático en entrenamientos clave.", ex: "Ej. Simulador IA para atención a clientes o liderazgo situacional." },
		'Medición e Impacto': { rec: "Construye dashboards que conecten aprendizaje con KPIs operativos.", ex: "Ej. Dashboard IA que relacione capacitación en ventas con cierres logrados." },
		'Engagement y Experiencia': { rec: "Aplica IA para crear experiencias gamificadas que respondan al progreso del usuario.", ex: "Ej. Sistema de puntos y misiones IA en onboarding o programas de cultura." }
	};


	const opportunityVisuals = {
		'Escalabilidad y Personalización': {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
			color: 'var(--intelego-blue)',
			bgColor: '#e3f2fd'
		},
		'Práctica y Feedback': {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/><path d="m11 12-4-4 4-4"/><path d="m7 12h11"/></svg>`,
			color: 'var(--intelego-coral)',
			bgColor: '#ffebe9'
		},
		'Medición e Impacto': {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
			color: 'var(--intelego-green)',
			bgColor: '#e8f5e9'
		},
		'Engagement y Experiencia': {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h12"/><path d="M12 6V3"/><path d="M12 18v3"/><path d="M8.5 8.5 6 6"/><path d="m18 6-2.5 2.5"/><path d="m6 18 2.5-2.5"/><path d="M15.5 15.5 18 18"/><path d="M2 12h1.5"/><path d="M20.5 12H22"/><circle cx="12" cy="12" r="6"/></svg>`,
			color: 'var(--intelego-amber)',
			bgColor: '#fff8e1'
		}
	};


// Función para calcular el nivel de madurez de la primera parte
const calculateMaturityLevel = (answers) => {
	const levelValues = {
		"Digitación": 1,
		"Digitalización": 2,
		"Transformación Digital": 3,
		"Beyond Digital": 4
	};

	const totalScore = answers.reduce((sum, answer) => {
		return sum + levelValues[answer.level];
	}, 0);

	const average = totalScore / answers.length;

	// Determinar el nivel basado en el promedio
	if (average <= 1.5) return { level: "Digitación", color: "🟥", score: average };
	if (average <= 2.5) return { level: "Digitalización", color: "🟧", score: average };
	if (average <= 3.5) return { level: "Transformación Digital", color: "🟨", score: average };
	return { level: "Beyond Digital", color: "🟩", score: average };
};

// Función para calcular la brecha más alta de la segunda parte
const calculateOpportunityGap = (part2Answers) => {
	const categories = Object.keys(opportunityQuestions);
	const categoryScores = {};

	// Calcular puntuación por categoría
	categories.forEach(category => {
		const categoryAnswers = [];
		for (let i = 0; i < 2; i++) {
			const answerKey = `${category}-${i}`;
			if (part2Answers[answerKey]) {
				categoryAnswers.push(part2Answers[answerKey]);
			}
		}
		
		if (categoryAnswers.length > 0) {
			const totalScore = categoryAnswers.reduce((sum, answer) => sum + answer.score, 0);
			const maxPossible = categoryAnswers.length * 2; // Máximo 2 puntos por pregunta
			categoryScores[category] = {
				score: totalScore,
				percentage: (totalScore / maxPossible) * 100,
				maxPossible
			};
		}
	});

	// Encontrar la categoría con menor puntuación (mayor brecha)
	let lowestCategory = null;
	let lowestScore = 100;

	Object.entries(categoryScores).forEach(([category, data]) => {
		if (data.percentage < lowestScore) {
			lowestScore = data.percentage;
			lowestCategory = category;
		}
	});

	// Si la puntuación más baja es muy alta (ej. >80%), no hay brechas significativas
	if (lowestScore > 80) {
		lowestCategory = null;
	}

	return {
		biggestGap: lowestCategory,
		categoryScores,
		insight: lowestCategory ? opportunityQuestions[lowestCategory].breachInsight : null,
		recommendation: lowestCategory ? actionableRecommendations[lowestCategory] : null
	};
};



// Agregar estado para almacenar el resultado de la primera parte
const [part1Result, setPart1Result] = useState(null);
// Agregar estado para almacenar el resultado de la segunda parte
const [part2Result, setPart2Result] = useState(null);


// Agregar estado para almacenar historial de resultados
const [resultsHistory, setResultsHistory] = useState([]);

// Función para guardar resultado simple
const saveResultToHistory = (part1Result, part2Result) => {
	const simpleResult = {
		id: Date.now(), // ID único basado en timestamp
		timestamp: new Date().toISOString(),
		userName: GConText.nombre,
		maturityLevel: part1Result.level,
		maturityScore: part1Result.score,
		biggestGap: part2Result.biggestGap,
		completed: true
	};

	// Agregar al array
	const newHistory = [...resultsHistory, simpleResult];
	setResultsHistory(newHistory);

	// Guardar en localStorage para persistencia
	localStorage.setItem('quizResults', JSON.stringify(newHistory));
	
	console.log("🚀 Resultado guardado:", simpleResult);
};


// Función para cargar un resultado guardado
const loadSavedResult = (resultId) => {
	const result = resultsHistory.find(r => r.id === resultId);
	if (!result) {
		console.log("❌ Resultado no encontrado");
		return;
	}

	// Reconstruir part1Result
	const reconstructedPart1 = {
		level: result.maturityLevel,
		score: result.maturityScore,
		color: result.maturityLevel === "Digitación" ? "🟥" : 
			   result.maturityLevel === "Digitalización" ? "🟧" :
			   result.maturityLevel === "Transformación Digital" ? "🟨" : "🟩"
	};

	// Reconstruir part2Result
	const reconstructedPart2 = {
		biggestGap: result.biggestGap,
		insight: result.biggestGap ? opportunityQuestions[result.biggestGap]?.breachInsight : null,
		recommendation: result.biggestGap ? actionableRecommendations[result.biggestGap] : null
	};

	// Cargar los resultados en el estado
	setPart1Result(reconstructedPart1);
	setPart2Result(reconstructedPart2);
	
	// Ir directamente a la pantalla de resultados
	setQuizStep('results');
	
	console.log("✅ Resultado cargado:", result);
};

// Función para mostrar lista de resultados guardados
/* const showSavedResults = () => {
	if (resultsHistory.length === 0) {
		console.log("No hay resultados guardados");
		return;
	}

	console.log("📋 Resultados guardados:");
	resultsHistory.forEach((result, index) => {
		const date = new Date(result.timestamp).toLocaleDateString();
		console.log(`${index + 1}. ID: ${result.id} - ${result.userName} - ${result.maturityLevel} - ${date}`);
	});
}; */

// Función para interpretar resultados del array
const interpretResult = (resultId) => {
	const result = resultsHistory.find(r => r.id === resultId);
	if (!result) return null;

	return {
		maturityInfo: {
			level: result.maturityLevel,
			description: maturityStages[result.maturityLevel],
			insight: maturityInsights[result.maturityLevel]
		},
		opportunityInfo: result.biggestGap ? {
			category: result.biggestGap,
			insight: opportunityQuestions[result.biggestGap]?.breachInsight,
			recommendation: actionableRecommendations[result.biggestGap],
			visual: opportunityVisuals[result.biggestGap]
		} : null
	};
};


// Función para guardar resultado en DynamoDB
const saveResultToDynamoDB = async (part1Result, part2Result) => {
	const resultData = {
		id: Date.now(),
		timestamp: new Date().toISOString(),
		userName: GConText.nombre,
		maturityLevel: part1Result.level,
		maturityScore: part1Result.score,
		biggestGap: part2Result.biggestGap,
		completed: true
	};

	try {
		const API_BASE = process.env.REACT_APP_API_BASE;
		const token = sessionStorage.getItem('accessToken');
		
		const response = await fetch(`${API_BASE}/save-quiz-result`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				quizResults: resultData // Enviar como objeto para guardar en un campo
			})
		});

		if (response.ok) {
			console.log("✅ Resultado guardado en DynamoDB");
			
			// También guardar localmente para acceso inmediato
			const newHistory = [...resultsHistory, resultData];
			setResultsHistory(newHistory);
			localStorage.setItem('quizResults', JSON.stringify(newHistory));
		} else {
			console.error("❌ Error guardando en DynamoDB");
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}
};

// Función para cargar resultados desde DynamoDB
const loadResultsFromDynamoDB = async () => {
	try {
		const API_BASE = process.env.REACT_APP_API_BASE;
		const token = sessionStorage.getItem('accessToken');
		
		const response = await fetch(`${API_BASE}/get-quiz-results`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		if (response.ok) {
			const data = await response.json();
			if (data.quizResults && Array.isArray(data.quizResults)) {
				setResultsHistory(data.quizResults);
				localStorage.setItem('quizResults', JSON.stringify(data.quizResults));
				console.log("✅ Resultados cargados desde DynamoDB");
			}
		}
	} catch (error) {
		console.error("❌ Error cargando desde DynamoDB:", error);
		// Fallback a localStorage
		const savedResults = localStorage.getItem('quizResults');
		if (savedResults) {
			setResultsHistory(JSON.parse(savedResults));
		}
	}
};


// Modificar handleAnswer para calcular el resultado cuando termine la parte 2
const handleAnswer = (answer) => {
	setIsTransitioning(true);
	
	setTimeout(() => {
		if (quizStep === 'part1-quiz') {
			const newAnswers = [...answers, answer];
			setAnswers(newAnswers);
			if (currentQuestion < quizQuestions.length - 1) {
				setCurrentQuestion(currentQuestion + 1);
			} else {
				// Calcular resultado de la primera parte
				const result = calculateMaturityLevel(newAnswers);
				setPart1Result(result);
				console.log("🚀 Resultado Parte 1:", result);
				
				setQuizStep('part2-intro');
				setCurrentQuestion(0);
			}
		} else if (quizStep === 'part2-quiz') {
			const categories = Object.keys(opportunityQuestions);
			const currentCategory = categories[Math.floor(currentQuestion / 2)];
			const questionIndex = currentQuestion % 2;
			
			const newPart2Answers = {
				...part2Answers,
				[`${currentCategory}-${questionIndex}`]: answer
			};
			setPart2Answers(newPart2Answers);

			if (currentQuestion < 7) {
				setCurrentQuestion(currentQuestion + 1);
			} else {
				// Calcular resultado de la segunda parte
				const result = calculateOpportunityGap(newPart2Answers);
				setPart2Result(result);
				console.log("🚀 Resultado Parte 2:", result);
				
				// Guardar resultado completo en el historial
				//saveResultToHistory(part1Result, result);
				// Guardar en DynamoDB en lugar de localStorage
				saveResultToDynamoDB(part1Result, result);

				setQuizStep('results');
			}
		}
		setIsTransitioning(false);
	}, 300);
};

// Cargar historial al inicializar el componente
useEffect(() => {
	/* const savedResults = localStorage.getItem('quizResults');
	if (savedResults) {
		setResultsHistory(JSON.parse(savedResults));
	} */
	loadResultsFromDynamoDB(); // Cargar desde DynamoDB
}, []);

// Para interpretar un resultado específico
/* const interpretedResult = interpretResult(1234567890); // usando el ID
console.log(interpretedResult); */

// Para mostrar historial
/* resultsHistory.forEach(result => {
	console.log(`${result.userName}: ${result.maturityLevel} - ${result.biggestGap || 'Sin brechas'}`);
}); */


if (quizStep === 'part1-intro') {
	return (
		<div className="dashboard-background">
			<div className="dashboard-form">
				<div className="dashboard-logo-container">
					<h1 className="dashboard-title">Evalúa tu nivel de madurez digital en capacitación</h1>
					<p className="dashboard-question-text">Selecciona las respuestas que mejor representen cómo opera actualmente tu área o empresa en temas de capacitación.</p>
					<p className="dashboard-question-text">No hay respuestas correctas: lo importante es reconocer tu punto de partida.”</p>
				</div>
				<button className="dashboard-btn" onClick={() => setQuizStep('part1-quiz')}>
					Comenzar mi diagnóstico
				</button>
			</div>
		</div>
	);
}

if (quizStep === 'part1-quiz') {
	// Agregar esta validación
	if (currentQuestion >= quizQuestions.length) {
		setCurrentQuestion(0);
		return null;
	}

	const question = quizQuestions[currentQuestion];
	return (
		<div className="dashboard-background">
			<div className={`dashboard-form dashboard-quiz-container ${isTransitioning ? 'transitioning' : ''}`}>
				<div className="dashboard-logo-container">
					<h4 className="dashboard-title" style={{ fontSize: '20px' }}>Pregunta {currentQuestion + 1}/5</h4>
					<p className="dashboard-question-text">{question.q}</p>
				</div>
				<div className="dashboard-btn-grid">
					{question.a.map((answer, index) => (
						<button 
							key={index} 
							className="dashboard-answer-btn"
							disabled={isTransitioning}
							onClick={() => handleAnswer(answer)}
						>
							{answer.text}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

if (quizStep === 'part2-intro') {
	return (
		<div className="dashboard-background">
			<div className="dashboard-form">
				<div className="dashboard-logo-container">
					<h2 className="dashboard-title">Identificación de Oportunidades</h2>
					<p className="dashboard-question-text">
						Ahora descubramos en qué áreas específicas puedes potenciar tu estrategia con IA.
					</p>
				</div>
				<button className="dashboard-btn" onClick={() => setQuizStep('part2-quiz')}>
					Explorar mis oportunidades
				</button>
			</div>
		</div>
	);
}


if (quizStep === 'part2-quiz') {
	const categories = Object.keys(opportunityQuestions);
	const currentCategory = categories[Math.floor(currentQuestion / 2)];
	const questionIndex = currentQuestion % 2;

	// Agregar esta validación también
	if (!opportunityQuestions[currentCategory] || !opportunityQuestions[currentCategory].questions[questionIndex]) {
		setCurrentQuestion(0);
		return null;
	}

	const question = opportunityQuestions[currentCategory].questions[questionIndex];

	return (
		<div className="dashboard-background">
			<div className={`dashboard-form dashboard-quiz-container ${isTransitioning ? 'transitioning' : ''}`}>
				<div className="dashboard-logo-container">
					<h4 className="dashboard-title" style={{ fontSize: '20px' }}>Pregunta {currentQuestion + 1}/8</h4>
					<h6 className="dashboard-category-text">{currentCategory}</h6>
					<p className="dashboard-question-text">{question.q}</p>
				</div>
				<div className="dashboard-btn-grid">
					{question.a.map((answer, index) => (
						<button 
							key={index} 
							className="dashboard-answer-btn"
							disabled={isTransitioning}
							onClick={() => handleAnswer(answer)}
						>
							{answer.text}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

if (quizStep === 'results') {
	return (
		<div className="dashboard-background">
			<div className="dashboard-form" style={{ maxWidth: '800px' }}>
				<div className="dashboard-logo-container">
					{/* <h2 className="dashboard-title">Tu Radar de Madurez Digital</h2> */}
					
					{/* Resultado de la Parte 1 */}
					{part1Result && (
						<div style={{ marginBottom: '30px' }}>

							{/* Descripción del nivel */}
							<div style={{
								background: '#f8f9fa',
								padding: '20px',
								borderRadius: '12px',
								marginBottom: '20px'
							}}>
								<h3 style={{ fontSize: '24px', marginBottom: '15px', textAlign: 'center' }}>
									{/* {part1Result.color} */} Nivel: {part1Result.level}
								</h3>
								<p style={{ fontSize: '16px', margin: '0', color: '#6c757d', lineHeight: '1.5' }}>
									{maturityStages[part1Result.level]}
								</p>
							</div>

							{/* Insights y recomendaciones */}
							<div style={{
								background: '#e8f5e9',
								padding: '20px',
								borderRadius: '12px',
								marginBottom: '20px'
							}}>
								<h4 style={{ fontSize: '18px', marginBottom: '10px', color: '#2e7d32' }}>
									Recomendación personalizada:
								</h4>
								<div
									style={{ fontSize: '16px', margin: '0', color: '#2e7d32', lineHeight: '1.5' }}
									dangerouslySetInnerHTML={{ __html: maturityInsights[part1Result.level] }}
								/>
							</div>
						</div>
					)}

					{/* Resultado de la Parte 2 */}
					{part2Result && (
						<div style={{ marginBottom: '30px' }}>
							{part2Result.biggestGap ? (
								<>
									{/* Tarjeta visual con icono */}
									<div style={{ 
										background: opportunityVisuals[part2Result.biggestGap]?.bgColor || '#f8f9fa',
										padding: '20px', 
										borderRadius: '12px', 
										marginBottom: '20px',
										border: `2px solid ${opportunityVisuals[part2Result.biggestGap]?.color || '#6c757d'}`,
										textAlign: 'center'
									}}>
										<div 
											style={{ 
												display: 'inline-block',
												padding: '15px',
												borderRadius: '50%',
												background: 'white',
												marginBottom: '15px',
												color: opportunityVisuals[part2Result.biggestGap]?.color || '#6c757d'
											}}
											dangerouslySetInnerHTML={{ 
												__html: opportunityVisuals[part2Result.biggestGap]?.icon || '' 
											}}
										/>
										<h4 style={{ 
											fontSize: '18px', 
											marginBottom: '10px',
											color: opportunityVisuals[part2Result.biggestGap]?.color || '#6c757d'
										}}>
											{/* 🎯  */}Tu Mayor Oportunidad: <br></br>
										</h4>
										<p style={{ 
											fontSize: '16px', 
											margin: '0', color: 
											opportunityVisuals[part2Result.biggestGap]?.color || '#6c757d', 
											lineHeight: '1.5' }}>
											{part2Result.biggestGap}
										</p>
									</div>
									
									{/* Insight de la brecha */}
									<div style={{ 
										background: '#fff3cd', 
										padding: '20px', 
										borderRadius: '12px', 
										marginBottom: '20px'
									}}>
										<h4 style={{ fontSize: '18px', marginBottom: '10px', color: '#856404' }}>
											Oportunidad detectada:
										</h4>
										<p style={{ fontSize: '16px', margin: '0', color: '#856404', lineHeight: '1.5' }}>
											{part2Result.insight}
										</p>
									</div>

									{/* Recomendación accionable */}
									{part2Result.recommendation && (
										<div style={{ 
											background: '#d1ecf1', 
											padding: '20px', 
											borderRadius: '12px'
										}}>
											<h4 style={{ fontSize: '18px', marginBottom: '10px', color: '#0c5460' }}>
												Acción recomendada:
											</h4>
											<p style={{ fontSize: '16px', margin: '0 0 10px 0', color: '#0c5460', lineHeight: '1.5' }}>
												{part2Result.recommendation.rec}
											</p>
											<p style={{ fontSize: '14px', margin: '0', color: '#0c5460', fontStyle: 'italic' }}>
												{part2Result.recommendation.ex}
											</p>
										</div>
									)}
								</>
							) : (
								/* Mensaje cuando no hay brechas */
								<div style={{ 
									background: '#d4edda', 
									padding: '20px', 
									borderRadius: '12px', 
									textAlign: 'center',
									border: '2px solid #28a745'
								}}>
									<h3 style={{ 
										fontSize: '20px', 
										marginBottom: '10px',
										color: '#155724'
									}}>
										🎉 ¡Felicidades!
									</h3>
									<p style={{ fontSize: '16px', margin: '0', color: '#155724', lineHeight: '1.5' }}>
										No se detectaron brechas de oportunidad significativas en el Paso 2.
									</p>
								</div>
							)}
						</div>
					)}


				</div>
				
				<div className="dashboard-btn-grid">
					<button className="dashboard-btn" onClick={() => setQuizStep('dashboard')}>
						Volver al Dashboard
					</button>
					
					<button className="dashboard-btn-secondary" onClick={() => {
						setQuizStep('part1-intro');
						setCurrentQuestion(0);
						setAnswers([]);
						setPart2Answers({});
						setPart1Result(null);
						setPart2Result(null);
					}}>
						Realizar nuevo diagnóstico
					</button>
				</div>
			</div>
		</div>
	);
}

// Agregar la pantalla de historial antes del return final
if (quizStep === 'history') {
	return (
		<div className="dashboard-background">
			<div className="dashboard-form" style={{ maxWidth: '800px' }}>
				<div className="dashboard-logo-container">
					<h2 className="dashboard-title">Historial de Resultados</h2>
					<p className="dashboard-question-text">Selecciona un resultado para verlo en detalle</p>
				</div>
				
				{resultsHistory.length === 0 ? (
					<div style={{ textAlign: 'center', padding: '20px' }}>
						<p>No hay resultados guardados aún.</p>
					</div>
				) : (
					<div style={{ marginBottom: '20px' }}>
						{resultsHistory.map((result, index) => {
							const date = new Date(result.timestamp).toLocaleDateString();
							const time = new Date(result.timestamp).toLocaleTimeString();
							
							return (
								<div 
									key={result.id}
									style={{
										background: '#f8f9fa',
										padding: '15px',
										borderRadius: '8px',
										marginBottom: '10px',
										border: '1px solid #dee2e6',
										cursor: 'pointer'
									}}
									onClick={() => loadSavedResult(result.id)}
								>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<div>
											<h5 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
												{result.userName} - {result.maturityLevel}
											</h5>
											<p style={{ margin: '0', fontSize: '14px', color: '#6c757d' }}>
												{result.biggestGap ? `Oportunidad: ${result.biggestGap}` : 'Sin brechas detectadas'}
											</p>
										</div>
										<div style={{ textAlign: 'right' }}>
											<p style={{ margin: '0', fontSize: '12px', color: '#6c757d' }}>
												{date}
											</p>
											<p style={{ margin: '0', fontSize: '12px', color: '#6c757d' }}>
												{time}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
				
				<div className="dashboard-btn-grid">
					<button className="dashboard-btn" onClick={() => setQuizStep('dashboard')}>
						Volver al Dashboard
					</button>
				</div>
			</div>
		</div>
	);
}

// Función para logout
const handleLogout = async () => {
	try {
		const API_BASE = process.env.REACT_APP_API_BASE;
		await fetch(`${API_BASE}/logout`, {
			method: 'POST',
			credentials: 'include'
		});
		
		// Limpiar datos locales
		sessionStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('quizResults');
		
		// Redirigir al login
		window.location.href = '/';
	} catch (error) {
		console.error('Error en logout:', error);
		// Limpiar datos locales aunque falle la llamada
		sessionStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		window.location.href = '/';
	}
};

return (
  <div className="dashboard-background">
    <div className="dashboard-form">
      <div className="dashboard-logo-container">
        <img className='mb-3' src={avatar} alt="" width="120" />
        <h2 className='dashboard-title'>¡Hola!</h2>
        <h4 className='text-center'>{GConText.nombre}</h4>
      </div>

      <div className="dashboard-btn-grid">
        <Link className='dashboard-btn-secondary' to="/instrucciones">
          Instrucciones
        </Link>
        <button 
          className='dashboard-btn' 
          onClick={() => {
				setQuizStep('part1-intro');
				setCurrentQuestion(0);
				setAnswers([]);
				setPart2Answers({});
			}}
		>
          Comenzar Quiz
        </button>

		{/* Botones para resultados guardados */}
		{resultsHistory.length > 0 && (
			<>
				<button 
					className='dashboard-btn-secondary' 
					onClick={() => {
						// Cargar el resultado más reciente
						const latestResult = resultsHistory[resultsHistory.length - 1];
						loadSavedResult(latestResult.id);
					}}
				>
					Ver Último Resultado
				</button>
				
				<button 
					className='dashboard-btn-secondary' 
					onClick={() => setQuizStep('history')}
				>
					Ver Historial ({resultsHistory.length})
				</button>
			</>
		)}
      </div>
    </div>

    {/* Icono de logout en la esquina inferior derecha */}
    <div 
		className="dashboard-badge" 
		style={{ 
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			gap: '5px'
		}}
		onClick={handleLogout}
		title="Cerrar sesión"
	>
		<FontAwesomeIcon icon={faSignOutAlt} />
		Salir
    </div>


  </div>
)


}

export default Dashboard
