import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Custom CSS for specific design elements
const style = document.createElement('style');
style.textContent = `
  .text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
  .hover-scale { transition: transform 0.3s ease; }
  .hover-scale:hover { transform: scale(1.03); }

  /* Custom colors */
  :root {
    --turquoise: #3CBFAE;
    --turquoise-light: #9FDED5;
    --turquoise-dark: #2A9D8F;
    --sage: #B8C4B8;
    --sage-light: #D8E0D8;
    --sage-dark: #94A094;
    --gold: #D4B78F;
    --gold-light: #E8D7BA;
    --gold-dark: #BE9B67;
    --charcoal: #333333;
    --charcoal-light: #5C5C5C;
    --charcoal-dark: #242424;
  }

  /* Custom fonts */
  .font-playfair {
    font-family: 'Playfair Display', serif;
  }
  
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
  
  .font-cormorant {
    font-family: 'Cormorant Garamond', serif;
  }

  /* Background colors */
  .bg-turquoise {
    background-color: var(--turquoise);
  }
  
  .bg-turquoise-light {
    background-color: var(--turquoise-light);
  }
  
  .bg-turquoise-dark {
    background-color: var(--turquoise-dark);
  }

  .bg-sage {
    background-color: var(--sage);
  }
  
  .bg-sage-light {
    background-color: var(--sage-light);
  }
  
  .bg-sage-dark {
    background-color: var(--sage-dark);
  }

  .bg-gold {
    background-color: var(--gold);
  }
  
  .bg-gold-light {
    background-color: var(--gold-light);
  }
  
  .bg-gold-dark {
    background-color: var(--gold-dark);
  }

  .bg-charcoal {
    background-color: var(--charcoal);
  }
  
  .bg-charcoal-light {
    background-color: var(--charcoal-light);
  }
  
  .bg-charcoal-dark {
    background-color: var(--charcoal-dark);
  }

  /* Text colors */
  .text-turquoise {
    color: var(--turquoise);
  }
  
  .text-turquoise-light {
    color: var(--turquoise-light);
  }
  
  .text-turquoise-dark {
    color: var(--turquoise-dark);
  }

  .text-sage {
    color: var(--sage);
  }
  
  .text-sage-light {
    color: var(--sage-light);
  }
  
  .text-sage-dark {
    color: var(--sage-dark);
  }

  .text-gold {
    color: var(--gold);
  }
  
  .text-gold-light {
    color: var(--gold-light);
  }
  
  .text-gold-dark {
    color: var(--gold-dark);
  }

  .text-charcoal {
    color: var(--charcoal);
  }
  
  .text-charcoal-light {
    color: var(--charcoal-light);
  }
  
  .text-charcoal-dark {
    color: var(--charcoal-dark);
  }

  /* Border colors */
  .border-turquoise {
    border-color: var(--turquoise);
  }

  .border-sage {
    border-color: var(--sage);
  }

  .border-gold {
    border-color: var(--gold);
  }

  .border-charcoal {
    border-color: var(--charcoal);
  }

  /* Background opacity utilities */
  .bg-turquoise\/10 {
    background-color: rgba(60, 191, 174, 0.1);
  }

  .bg-turquoise\/30 {
    background-color: rgba(60, 191, 174, 0.3);
  }

  .bg-turquoise\/50 {
    background-color: rgba(60, 191, 174, 0.5);
  }

  .bg-sage\/10 {
    background-color: rgba(184, 196, 184, 0.1);
  }

  .bg-sage\/30 {
    background-color: rgba(184, 196, 184, 0.3);
  }

  body {
    font-family: 'Poppins', sans-serif;
    color: var(--charcoal);
  }
`;
document.head.appendChild(style);

import * as HelmetAsync from 'react-helmet-async';
const { HelmetProvider } = HelmetAsync;

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
