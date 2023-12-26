

function Weather(props) {


    return (
        <div>
            <div>
                <h3>{props.main.temp}</h3>
                <h2>{props.weather[0].main}</h2>
            </div>
            <div>
                <h3>{props.wind.speed}</h3>
                <h2>{props.clouds.all}</h2>
            </div>
        </div>
    )
}

export default Weather