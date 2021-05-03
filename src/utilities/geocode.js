const got = require('got')

const geocode = async (streetAddress, city, state, zipCode) => {
    try{
        let address1 = streetAddress.replace(/\s+/g, '')
        const url = `https://geocoder.ls.hereapi.com/search/6.2/geocode.json?languages=en-US&maxresults=1&searchtext=${address1}+${city}+${state}+${zipCode}&apiKey=okzuAwCdY2vxRTq3ivF-usc8u7atU5j7FOeaDVh2O_s`
        
        const response = await got.get(url, {responseType: 'json'})
        
        let longitude = response.body.Response.View[0].Result[0].Location.DisplayPosition.Longitude
        
        let latitude = response.body.Response.View[0].Result[0].Location.DisplayPosition.Latitude

        let positionArray = []
        positionArray.push(longitude)
        positionArray.push(latitude)
        console.log(positionArray)
        return positionArray

    } catch (error) {
        console.log(error.response.body)
    }
}

module.exports = geocode