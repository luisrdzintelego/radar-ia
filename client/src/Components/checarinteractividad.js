/* import { useState, useEffect, useRef, useCallback } from 'react';

function useInactivity(timeoutMs = 60000) {
  const [isInactive, setIsInactive] = useState(false);
  const timeoutId = useRef(null);

  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setIsInactive(true);
    }, timeoutMs);
    setIsInactive(false);
  }, [timeoutMs]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [resetTimer]);

  return isInactive;
}

export default useInactivity; */




/* import { useState, useEffect, useRef, useCallback } from 'react';

function useInactivity(timeoutMs = 60000, iframeRef = null) {
  const [isInactive, setIsInactive] = useState(false);
  const timeoutId = useRef(null);

  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setIsInactive(true);
    }, timeoutMs);
    setIsInactive(false);
  }, [timeoutMs]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];

    // Escucha eventos en window principal
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Escucha eventos en el iframe si existe y está cargado
    let iframeDoc = null;
    if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
      iframeDoc = iframeRef.current.contentWindow.document;
      events.forEach(event => iframeDoc.addEventListener(event, resetTimer));
    }

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (iframeDoc) {
        events.forEach(event => iframeDoc.removeEventListener(event, resetTimer));
      }
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, [resetTimer, iframeRef]);

  return isInactive;
}

export default useInactivity; */


import { useState, useEffect, useRef, useCallback } from 'react';

function useInactivity(timeoutMs = 60000, iframeRef = null) {
  const [isInactive, setIsInactive] = useState(false);
  const timeoutId = useRef(null);
  const lastEventTime = useRef(Date.now());

  const resetTimer = useCallback((event) => {
    const now = Date.now();
    lastEventTime.current = now;
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    timeoutId.current = setTimeout(() => {
      setIsInactive(true);
    }, timeoutMs);
    setIsInactive(false);

    // Mostrar en consola el evento y el tiempo restante
    //const remaining = timeoutMs / 1000;
    //console.log(`[Inactividad] Evento: ${event?.type || 'manual'} | Tiempo restante: ${remaining}s`);
  }, [timeoutMs]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];

    // Handler para eventos
    const handler = (event) => resetTimer(event);

    // Escucha eventos en window principal
    events.forEach(event => window.addEventListener(event, handler));

    // Escucha eventos en el iframe si existe y está cargado
    /* let iframeDoc = null;
    if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
      iframeDoc = iframeRef.current.contentWindow.document;
      events.forEach(event => iframeDoc.addEventListener(event, handler));
    } */

    // Inicializa el timer
    //resetTimer();

    // Intervalo para mostrar el tiempo restante cada segundo
    const interval = setInterval(() => {
	if (!isInactive) {
		const elapsed = (Date.now() - lastEventTime.current) / 1000;
		const remaining = Math.max(0, timeoutMs / 1000 - elapsed);
		const min = Math.floor(remaining / 60);
		const seg = Math.floor(remaining % 60);
		//console.log(`[Inactividad] Tiempo restante: ${min}m ${seg < 10 ? '0' : ''}${seg}s`);
		// Solo mostrar el log cuando los segundos sean 0 (cada minuto exacto)
		if (seg === 0) {
		// console.log(`[Inactividad] Tiempo restante: ${min}m 00s`);
		}
	}
	}, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handler));
      /* if (iframeDoc) {
        events.forEach(event => iframeDoc.removeEventListener(event, handler));
      } */
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      clearInterval(interval);
    };
  }, [resetTimer, iframeRef, isInactive, timeoutMs]);
  

  return [isInactive, resetTimer];
}

export default useInactivity;