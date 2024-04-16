import React, { useEffect, useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://starkville.org/events/2024-04/');
        const html = response.data;
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html");
        const scriptElement = doc.querySelector('.yoast-schema-graph');
        const jsonData = JSON.parse(scriptElement.innerHTML);
        const fetchedEvents = jsonData['@graph'].filter(item => item['@type'] === 'Event');
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  function decodeHtmlUsingDOMParser(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.documentElement.textContent;
  }
  return (
    <div>
      <header>
        <h1>Event App</h1>
      </header>
      <section className="happening-now">
        <h2 className="section-title">Happening Now</h2>
        <div className="event-cards">
          {events.map(event => (
            <div className="event-card" key={event['@id']}>
              <h3>{decodeHtmlUsingDOMParser(event.name)}</h3>
              <p>{decodeHtmlUsingDOMParser(event.description)}</p>
              <p>Start Date: {event.startDate}</p>
              <p>End Date: {event.endDate}</p>              
              {event.location && <p>Location: {decodeHtmlUsingDOMParser(event.location.name)}</p> }
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;