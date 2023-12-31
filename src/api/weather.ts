import { CityData } from '../types/city';
import { WeatherData } from '../types/weather';
import { client } from './instance';

export const getTomorrowWR = (city: CityData) => client.get<WeatherData>(`/forecast?latitude=${city.latitude}&longitude=${city.longitude}&hourly=winddirection_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`);

export const getWeekWR = (current: CityData) => client.get<WeatherData>(`/forecast?latitude=${current.latitude}&longitude=${current.longitude}&hourly=winddirection_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`);
