import axios from 'axios';

export default class DataProvider {
 
    static getPCAData(){

        return axios.get('https://raw.githubusercontent.com/HongyuJiang/HDVIS/master/data/2010-province-pca-points.csv')
    }
    static getPopulationData(){

        return axios.get('https://raw.githubusercontent.com/HongyuJiang/HDVIS/master/data/2010-population.csv')
    }
    static getMapData(){

        return axios.get('https://raw.githubusercontent.com/HongyuJiang/HDVIS/master/data/china.json')
    }
}