// AdminAnalytics.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faEdit, faTrash, faSave, faUpload, faDownload, faFileArrowDown, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

import { Bar, Pie, Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement
);

const AdminAnalytics = () => {
	const [analytics, setAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		grupo: '',
		maturityLevel: '',
		opportunity: '',
		fechaDesde: '',
		fechaHasta: ''
	});


	useEffect(() => {
		loadAnalytics();
	}, []);

	const loadAnalytics = async () => {
		try {
			const API_BASE = process.env.REACT_APP_API_BASE;
			const token = sessionStorage.getItem('accessToken');

			const response = await fetch(`${API_BASE}/admin/quiz-analytics`, {
				headers: { 'Authorization': `Bearer ${token}` },
				credentials: 'include'
			});

			if (response.ok) {
				const data = await response.json();
				console.log("🔍 Analytics data:", data);
				console.log("🔍 Raw results:", data.rawResults); // Cambiar esta línea
				//(data.analytics);
				// Agregar rawResults al objeto analytics
				setAnalytics({
					...data.analytics,
					rawResults: data.rawResults  // Agregar esta línea
				});
			}
		} catch (error) {
			console.error('Error cargando analytics:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div>Cargando analytics...</div>;
	if (!analytics) return <div>Error cargando datos</div>;

	// AGREGAR AQUÍ los console.log antes del return
	//console.log("🔍 Analytics state:", analytics);
	//console.log("🔍 Raw results in state:", analytics?.rawResults);

	// Datos para gráfica de niveles de madurez
	const maturityData = {
		labels: Object.keys(analytics.maturityLevels),
		datasets: [{
			label: 'Usuarios por Nivel',
			data: Object.values(analytics.maturityLevels),
			backgroundColor: ['#ff6b6b', '#ffa726', '#ffee58', '#66bb6a'],
			borderWidth: 1
		}]
	};

	// Datos para gráfica de oportunidades
	const opportunityData = {
		labels: Object.keys(analytics.opportunities),
		datasets: [{
			label: 'Oportunidades Detectadas',
			data: Object.values(analytics.opportunities),
			backgroundColor: ['#42a5f5', '#ff7043', '#66bb6a', '#ffa726'],
		}]
	};

	// Datos para timeline
	const timelineData = {
		labels: Object.keys(analytics.timeline).sort(),
		datasets: [{
			label: 'Evaluaciones por Mes',
			data: Object.keys(analytics.timeline).sort().map(month => analytics.timeline[month]),
			borderColor: '#42a5f5',
			backgroundColor: 'rgba(66, 165, 245, 0.1)',
			tension: 0.4
		}]
	};


	// Función para filtrar los datos
	const filteredResults = analytics?.rawResults?.filter(result => {
		const resultDate = new Date(result.timestamp);
		const fechaDesde = filters.fechaDesde ? new Date(filters.fechaDesde) : null;
		const fechaHasta = filters.fechaHasta ? new Date(filters.fechaHasta) : null;

		return (
			(filters.grupo === '' || result.userGroup === filters.grupo) &&
			(filters.maturityLevel === '' || result.maturityLevel === filters.maturityLevel) &&
			(filters.opportunity === '' || result.biggestGap === filters.opportunity) &&
			(!fechaDesde || resultDate >= fechaDesde) &&
			(!fechaHasta || resultDate <= fechaHasta)
		);
	}) || [];

	// Obtener valores únicos para los filtros
	const uniqueGroups = [...new Set(analytics?.rawResults?.map(r => r.userGroup) || [])];
	const uniqueMaturityLevels = [...new Set(analytics?.rawResults?.map(r => r.maturityLevel) || [])];
	const uniqueOpportunities = [...new Set(analytics?.rawResults?.map(r => r.biggestGap).filter(Boolean) || [])];


	// Función para descargar CSV:
	const downloadCSV = () => {
		const headers = ['Usuario', 'Grupo', 'Nivel de Madurez', 'Puntuación', 'Mayor Oportunidad', 'Fecha'];
		const csvContent = [
			headers.join(','),
			...filteredResults.map(result => [
				result.userName,
				result.userGroup,
				result.maturityLevel,
				result.maturityScore?.toFixed(1) || 'N/A',
				result.biggestGap || 'Sin brechas detectadas',
				new Date(result.timestamp).toLocaleDateString()
			].join(','))
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `analytics-quiz-${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="container">
			<div className="dashboard-form" style={{ maxWidth: '100vw' }}>
				<h2 className="dashboard-title">Analytics del Quiz</h2>

				{/* Estadísticas generales */}
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
					<div className="dashboard-user-info" style={{ textAlign: 'center' }}>
						<h3>{analytics.totalResults}</h3>
						<p>Total Evaluaciones</p>
					</div>
					<div className="dashboard-user-info" style={{ textAlign: 'center' }}>
						<h3>{analytics.usersWithResults}</h3>
						<p>Usuarios Evaluados</p>
					</div>
					<div className="dashboard-user-info" style={{ textAlign: 'center' }}>
						<h3>{analytics.totalUsers}</h3>
						<p>Total Usuarios</p>
					</div>
				</div>

				{/* Gráficas */}
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>

					{/* Niveles de Madurez */}
					<div className="dashboard-user-info">
						<h4>Distribución por Nivel de Madurez</h4>
						<Bar data={maturityData} options={{ responsive: true }} />
					</div>

					{/* Oportunidades */}
					<div className="dashboard-user-info">
						<h4>Principales Oportunidades</h4>
						<Pie data={opportunityData} options={{ responsive: true }} />
					</div>

					{/* Timeline */}
					<div className="dashboard-user-info" style={{ gridColumn: '1 / -1' }}>
						<h4>Evaluaciones en el Tiempo</h4>
						<Line data={timelineData} options={{ responsive: true }} />
					</div>
				</div>

				{/* Tabla de resultados por grupo */}
				{/* <div className="dashboard-user-info" style={{ marginTop: '30px' }}>
          <h4>Resultados por Grupo</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Grupo</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>Evaluaciones</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Nivel Predominante</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analytics.byGroup).map(([group, data]) => {
                const predominantLevel = Object.entries(data.maturityLevels)
                  .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
                
                return (
                  <tr key={group} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '10px' }}>{group}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{data.count}</td>
                    <td style={{ padding: '10px' }}>{predominantLevel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> */}

				{/* Tabla con filtros - agregar después de las gráficas */}
				<div className="dashboard-user-info" style={{ marginTop: '30px' }}>
					<h4>Detalle de Usuarios y Resultados</h4>

					{/* Filtros fecha y botón descarga */}
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '15px',
						marginBottom: '20px',
						padding: '15px',
						backgroundColor: '#f8f9fa',
						borderRadius: '8px',
						alignItems: 'center'
					}}>
						{/* <div>
							<label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Filtrar por Grupo:</label>
							<select
								value={filters.grupo}
								onChange={(e) => setFilters({ ...filters, grupo: e.target.value })}
								style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dee2e6' }}
							>
								<option value="">Todos los grupos</option>
								{uniqueGroups.map(group => (
									<option key={group} value={group}>{group}</option>
								))}
							</select>
						</div> */}

						<div>
							<label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Filtrar por Nivel:</label>
							<select
								value={filters.maturityLevel}
								onChange={(e) => setFilters({ ...filters, maturityLevel: e.target.value })}
								style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dee2e6' }}
							>
								<option value="">Todos los niveles</option>
								{uniqueMaturityLevels.map(level => (
									<option key={level} value={level}>{level}</option>
								))}
							</select>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Filtrar por Oportunidad:</label>
							<select
								value={filters.opportunity}
								onChange={(e) => setFilters({ ...filters, opportunity: e.target.value })}
								style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dee2e6' }}
							>
								<option value="">Todas las oportunidades</option>
								{uniqueOpportunities.map(opp => (
									<option key={opp} value={opp}>{opp}</option>
								))}
							</select>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Desde:</label>
							<input
								type="date"
								value={filters.fechaDesde}
								onChange={(e) => setFilters({ ...filters, fechaDesde: e.target.value })}
								style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dee2e6' }}
							/>
						</div>

						<div>
							<label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Hasta:</label>
							<input
								type="date"
								value={filters.fechaHasta}
								onChange={(e) => setFilters({ ...filters, fechaHasta: e.target.value })}
								style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #dee2e6' }}
							/>
						</div>

						<div style={{ display: 'flex', alignItems: 'end', gap: '10px' }}>
							<span className='btn_ch me-1'
								onClick={() => setFilters({maturityLevel: '', opportunity: '', fechaDesde: '', fechaHasta: '' })}
								style={{

									backgroundColor: '#6c757d',
									color: 'white',
									cursor: 'pointer'
								}}
							>
								Limpiar Filtros
							</span>

							<span className='btn_ch me-1'
								onClick={downloadCSV}
								style={{
									backgroundColor: '#28a745',
									color: 'white',
									cursor: 'pointer'
								}}
							>
								<FontAwesomeIcon icon={faDownload} />Descargar CSV
							</span>
						</div>
					</div>

					{/* Tabla */}
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
							<thead>
								<tr style={{ borderBottom: '2px solid #dee2e6', backgroundColor: '#f8f9fa' }}>
									<th style={{ padding: '12px', textAlign: 'left' }}>Usuario</th>
									{/* <th style={{ padding: '12px', textAlign: 'left' }}>Grupo</th> */}
									<th style={{ padding: '12px', textAlign: 'center' }}>Nivel de Madurez</th>
									<th style={{ padding: '12px', textAlign: 'center' }}>Puntuación</th>
									<th style={{ padding: '12px', textAlign: 'left' }}>Mayor Oportunidad</th>
									<th style={{ padding: '12px', textAlign: 'center' }}>Fecha</th>
								</tr>
							</thead>
							<tbody>
								{filteredResults.map((result, index) => {
									const date = new Date(result.timestamp).toLocaleDateString();
									const maturityColor = {
										'Digitación': '#ff6b6b',
										'Digitalización': '#ffa726',
										'Transformación Digital': '#ffee58',
										'Beyond Digital': '#66bb6a'
									}[result.maturityLevel] || '#6c757d';

									return (
										<tr key={`${result.userId}-${index}`} style={{
											borderBottom: '1px solid #dee2e6'
										}}>
											<td style={{ padding: '12px', fontWeight: '500' }}>
												{result.userName}
											</td>
											{/* <td style={{ padding: '12px' }}>
												{result.userGroup}
											</td> */}
											<td style={{
												padding: '12px',
												textAlign: 'center',
												color: maturityColor,
												fontWeight: '600'
											}}>
												{result.maturityLevel}
											</td>
											<td style={{ padding: '12px', textAlign: 'center' }}>
												{result.maturityScore?.toFixed(1) || 'N/A'}
											</td>
											<td style={{ padding: '12px' }}>
												{result.biggestGap || 'Sin brechas detectadas'}
											</td>
											<td style={{ padding: '12px', textAlign: 'center', fontSize: '14px', color: '#6c757d' }}>
												{date}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Contador */}
					<div style={{
						marginTop: '15px',
						padding: '10px',
						backgroundColor: '#f8f9fa',
						borderRadius: '8px',
						fontSize: '14px',
						color: '#6c757d'
					}}>
						Mostrando {filteredResults.length} de {analytics?.rawResults?.length || 0} usuarios con resultados de quiz
					</div>
				</div>


			</div>
		</div>
	);
};

export default AdminAnalytics;
