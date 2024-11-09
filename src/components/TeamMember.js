import React from 'react';
import { Heart, ShoppingCart, User } from 'lucide-react';

const TeamMember = ({ name, role, image }) => {
    return (
      <div className="team-member">
        <img src={image} alt={name} />
        <h3>{name}</h3>
        <p>{role}</p>
      </div>
    );
  };

  export default TeamMember;