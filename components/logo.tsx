import React from 'react';

// Define the props for the Logo component
interface LogoProps {
  iconSrc: string; // Source of the logo icon
  brandName: string; // Brand name to display
}

const Logo: React.FC<LogoProps> = ({ iconSrc, brandName }) => {
  return (
    <div style={styles.logoContainer}>
      <div style={styles.logoIconContainer}>
        <img src={iconSrc} alt={`${brandName} logo`} />
      </div>
      <span style={styles.brandName}>{brandName}</span>
    </div>
  );
};

// Inline styles for the component
const styles = {
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoIconContainer: {
    width: '60px', // Decreased size of the circular container
    height: '60px',
    borderRadius: '50%', // Keeps the container circular
    overflow: 'hidden', // Ensures the image fits within the circle
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #ccc', // Optional: add a border to the circle
  },
  logoIcon: {
    width: '100%', // Makes the image fill the container
    height: '100%',
    objectFit: 'cover', // Ensures the image covers the circle without distortion
  },
  brandName: {
    fontSize: '24px', // Decreased font size for brand name
    fontWeight: 'bold', // Makes brand name bold
    marginLeft: '10px', // Space between icon and brand name
  },
};

export default Logo;
