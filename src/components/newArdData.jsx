

export default function NewArduinoData({data})
{
 

    return(
        <div className="articleContainer">
          <h1>{data.mainTitle}</h1>
          <p>{data.intro}</p>
           <section className="sectionHeading ">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Objective</h2>
        <p className="paragraphText">To detect motion using a PIR sensor connected to an Arduino.</p>
      </section>
        </div>
    )
}