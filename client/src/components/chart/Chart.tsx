import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/charts";
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  margin: 64px 32px;
  padding-right: 300px;
`;

type DataType = string;

interface PieChartData {
  type: DataType;
  value: number;
}

const Chart = () => {
  const [data, setData] = useState<PieChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users");
        const userData = response.data;
        const cities: { [key: string]: number } = {};
        userData.forEach((user: any) => {
          const city = user.address.city;
          if (cities[city]) {
            cities[city] += 1;
          } else {
            cities[city] = 1;
          }
        });
        const cityData = Object.keys(cities).map((city) => {
          return { type: city, value: cities[city] };
        });
        setData(cityData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const config = {
    appendPadding: 10,
    data: data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.5,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 30,
      },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false as const,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        formatter: function formatter() {
          const total = data.reduce((sum, { value }) => sum + value, 0);
          return `total\n${total}`;
        },
      },
    },
  };

  return (
    <Wrapper>
      <Pie {...config} />
    </Wrapper>
  );
};

export default Chart;
