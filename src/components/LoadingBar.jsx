import { LoadingBar as LoadingBarComponent } from 'react-redux-loading-bar';

const LoadingBar = () => {
  return (
    <LoadingBarComponent
      style={{
        backgroundColor: '#4CAF50',
        height: '3px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    />
  );
};

export default LoadingBar;
