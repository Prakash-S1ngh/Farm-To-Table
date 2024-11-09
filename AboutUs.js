import React from 'react';
import './AboutUs.css'; // Import CSS
import TeamMember from './TeamMember';
import tisha from './tisha.jpg';
import prakash from './prakash.jpg';
import nitish from './nitish.jpg';
import isha from './ishaaa.jpg';
import ayush from './ayush.jpg';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-us-hero">
        <h1>About FarmToTable</h1>
        <p>Connecting farmers with consumers for fresh, organic, and locally grown products.</p>
      </div>

      <div className="about-us-content">
        <div className="about-us-text">
          <h2>Our Story</h2>
          <p>
            FarmToTable started with the mission to bring fresh, organic, and locally grown produce to everyone’s table. 
            We work directly with farmers to ensure that you get the best products while supporting local agriculture.
          </p>
        </div>

        <div className="about-us-text">
          <h2>What We Do</h2>
          <p>
            Our platform connects consumers with nearby farms, allowing direct purchases of fresh produce and ensuring 
            that farmers receive a fair price for their goods. By eliminating middlemen, we help both parties benefit.
          </p>
        </div>

        <div className="about-us-text">
          <h2>Our Values</h2>
          <p>
            Sustainability, transparency, and community are at the core of everything we do. We believe in creating 
            an ecosystem where consumers know exactly where their food comes from and farmers are empowered to grow better.
          </p>
        </div>
      </div>
      <section className="team">
                  <h2>Our Professional Members</h2>
                  <div className="team-grid">
                    <TeamMember name="Prakash Singh" role="CEO & Founder" image={prakash} />
                    <TeamMember name="Nitish Kumar" role="Chief Technology Officer (CTO)" image={nitish} />
                    <TeamMember name="Isha Shukla" role="Lead Designer" image={isha} />
                    <TeamMember name="Tisha Gupta" role="Marketing Head" image={tisha} />
                    <TeamMember name="Ayush Dubey" role="Operations Manager" image={ayush} />
                  </div>
                </section>
    </div>
    
  );
};

export default AboutUs;
