import React from 'react';
import { analizedImage, isConfigured as isAnalysisConfigured } from './azure-image-analysis';
import { generateImage, isConfigured as isGenerationConfigured } from './azure-image-generation';


function App() {

  
  // Title of the app
  const title = 'React App';
  // a input text for user can write a url path of image also user can write a requeste of image to generate
  const [inputText, setInputText] = React.useState('');
  // a button to relese analisis of image
  const [buttonText, setButtonText] = React.useState('Analizar');
  // a button to relese generate of image
  const [buttonTextGenerate, setButtonTextGenerate] = React.useState('Generar');

  const [results, setResults] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState('');

  if(!isAnalysisConfigured() || !isGenerationConfigured()) {
    return ( <p>Clave y/o punto final no configurados para los servicios cognitivos</p> );
  }
  // Return the App component.
  return (
    <div className="App">
      <h1>{title}</h1>
      <div>
        <input
          type="text"
          placeholder="Escribe una url o una palabra"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <br />
        <button
          onClick={async () => {
            setButtonText('Analizando...');
            const analysis = await analizedImage(inputText);
            setResults(analysis);
            setImageUrl(analysis.URL);
            setButtonText('Analizar');
          }}
        >
          {buttonText}
        </button>
        <button
          onClick={async () => {
            setButtonTextGenerate('Generando...');
            const result = await generateImage(inputText);
            setResults(result);
            setImageUrl(result.URL);
            setButtonTextGenerate('Generar');
          }}
        >
          {buttonTextGenerate}
        </button>
      </div>
      {results && <DisplayResults results={results} url={imageUrl} />}
    </div>
  );
}

/*
  Function called 'DisplayResults' that display the results of the api in legible form also show url of image processed
*/
function DisplayResults(props) {
  // a variable that contains the results of the api
  const results = props.results;
  // a variable that contains the url of the image processed
  const url = props.url;
  // a variable that contains the results of the api in legible form
  const resultsFormatted = JSON.stringify(results, null, 2);
  // Return the DisplayResults component.
  return (
    <div>
      <h2>Resultados</h2>
      <div>
        <img src={url} alt="Imagen procesada" width="200" height="200" />
      </div>
      <pre>{resultsFormatted}</pre>
    </div>
  );
}
export default App;
