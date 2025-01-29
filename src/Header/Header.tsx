import axios from "axios";
import { FC, useEffect, useState } from "react";
import { ICurrency } from "../types/types";

const Header: FC = () => {
  const [data, setData] = useState<ICurrency[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ICurrency[]>('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        setData(response.data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, []);

  const dollar = data.filter(item => item.cc === "USD");
  const euro = data.filter(item => item.cc === "EUR");
  return <div className="">
    <h1>Курс валют</h1>
    <h2>Доллар: {dollar.map(item => item.rate)} грн</h2>
    <h2>Євро: {euro.map(item => item.rate)} грн</h2>
  </div>
}

export default Header;