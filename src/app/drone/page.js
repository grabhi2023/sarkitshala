
import image1 from '../../../public/images/Drone.webp'
import Image from 'next/image';
const Drone = () => {
  return (
    <div className="articleContainer mt-20">
      
      
      
        <h1 >Drone Technology</h1>
        <Image height={400} width={600} src={image1} />
        <div >
          <p >
            A drone typically consists of several key components that allow it to fly and operate effectively.
          </p>
          
         
          <h2 >Basic Components of a Drone</h2>
          <ul >
            <li><strong>Frame:</strong> The structure that holds all the components of the drone.</li>
            <li><strong>Motors:</strong> Four motors provide the thrust required for flight.</li>
            <li><strong>Propellers:</strong> Attached to the motors to create lift.</li>
            <li><strong>Battery:</strong> Powers the drone for flight.</li>
            <li><strong>Flight Controller:</strong> The brain of the drone that controls the motors and stabilizes the drone during flight.</li>
            <li><strong>GPS Module:</strong> Helps the drone with navigation and location tracking.</li>
            <li><strong>Camera (Optional):</strong> For capturing video or photos during flight.</li>
          </ul>

         
          <h2 >Key Features</h2>
          <p >
            Drones are equipped with several features such as stability control, automated flying capabilities, and real-time video streaming. These features make drones highly versatile for various applications.
          </p>

       
          <div >
            <p >Learn More About Drone Technology</p>
           
          </div>
        </div>
   
      </div>
  
  );
};

export default Drone;
