import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './../cssFiles/MainPg.css'; // Make sure the path is correct

const MainPage = () => {
  return (
    <div className="main-page">
      <header>
        <div className="header-content">
          <h1>COLLECTIVERSE</h1>
          <div className="header-buttons">
            {/* Use the Link component for navigation */}
            <Link to="/SignUp" className="sign-up-button">SIGN UP</Link>
            <Link to="/Login" className="sign-in-button">SIGN IN</Link>
          </div>
        </div>
      </header>
      <main>
        <section className="game-introduction">
          <h2>What is Collectiverse?</h2> <br></br>
          <p>
            Collectiverse is an exciting game where you can collect virtual characters,
            embark on adventures, and build your unique collection.
          </p>
        </section>
        <section className="get-started">
          <h2>Get Started</h2>
        </section>
      </main>
      <footer>
        <p>© 2023 Collectiverse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;