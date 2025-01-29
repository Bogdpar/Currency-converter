import { FC, useEffect, useState } from "react"
import axios from "axios";
import { ICurrency } from "../types/types";
import styles from './Converter.module.scss'
const Converter: FC = () => {
  const [amountOne, setAmountOne] = useState<number>(1);
  const [amountTwo, setAmountTwo] = useState<number>(1);
  const [currencyOne, setCurrencyOne] = useState<string>("USD");
  const [currencyTwo, setCurrencyTwo] = useState<string>("EUR");
  const [currencyData, setCurrencyData] = useState<ICurrency[]>([]);
  const [isTyping, setIsTyping] = useState<"one" | "two">("one");

  useEffect(() => {
    axios
      .get<ICurrency[]>("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
      .then((response) => {
        setCurrencyData([...response.data, { r030: 980, txt: "Гривня", rate: 1, cc: "UAH", exchangedate: "" }]);
      })
      .catch((e) => console.error(e));
  }, []);

  const getRate = (currency: string): number => {
    const foundCurrency = currencyData.find((item) => item.cc === currency);
    return foundCurrency ? foundCurrency.rate : 1;
  };

  useEffect(() => {
    if (currencyData.length === 0 || isTyping === "two") return;
    const rateOne = getRate(currencyOne);
    const rateTwo = getRate(currencyTwo);
    const newAmount = (amountOne * rateOne) / rateTwo;
    if (newAmount !== amountTwo) setAmountTwo(newAmount);
  }, [amountOne, currencyOne, currencyTwo, currencyData]);

  useEffect(() => {
    if (currencyData.length === 0 || isTyping === "one") return;
    const rateOne = getRate(currencyOne);
    const rateTwo = getRate(currencyTwo);
    const newAmount = (amountTwo * rateTwo) / rateOne;
    if (newAmount !== amountOne) setAmountOne(newAmount);
  }, [amountTwo, currencyOne, currencyTwo, currencyData]);

  return (
    <div className={styles.converter}>
      <h1>Конвертер валют</h1>

      <div>
        <input
          className={styles.inp}
          type="number"
          value={amountOne}
          onChange={(e) => {
            setIsTyping("one");
            setAmountOne(parseFloat(e.target.value) || 0);
          }}
        />
        <select className={styles.sel} value={currencyOne} onChange={(e) => setCurrencyOne(e.target.value)}>
          {currencyData.map((currency) => (
            <option key={currency.cc} value={currency.cc}>
              {currency.cc} ({currency.txt})
            </option>
          ))}
        </select>
      </div>

      <p>⇄</p>

      <div>
        <input
          className={styles.inp}
          type="number"
          value={amountTwo}
          onChange={(e) => {
            setIsTyping("two");
            setAmountTwo(parseFloat(e.target.value) || 0);
          }}
        />
        <select className={styles.sel} value={currencyTwo} onChange={(e) => setCurrencyTwo(e.target.value)}>
          {currencyData.map((currency) => (
            <option key={currency.cc} value={currency.cc}>
              {currency.cc} ({currency.txt})
            </option>
          ))}
        </select>
      </div>

      <h2>
        {amountOne.toFixed(2)} {currencyOne} = {amountTwo.toFixed(2)} {currencyTwo}
      </h2>
    </div>
  );
};




export default Converter;