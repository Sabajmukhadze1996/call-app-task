import React from "react";
import { Pie } from "@ant-design/charts";
import styled from "styled-components";

const Wrapper = styled.div`
  margin: 64px 32px;
  padding-right: 300px
`;

type DataType = "new" | "evaluating" | "ongoing" | "finished" | "archived";

interface PieChartData {
  type: DataType;
  value: number;
}

const pieChartData: PieChartData[] = [
  {
    type: "new",
    value: 40
  },
  {
    type: "evaluating",
    value: 25
  },
  {
    type: "ongoing",
    value: 22
  },
  {
    type: "finished",
    value: 22
  },
  {
    type: "archived",
    value: 10,
  }
];

const config = {
  appendPadding: 10,
  data: pieChartData,
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
      fontSize: 30
    }
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
        return `total\n134`;
      }
    }
  }
};

const Chart = () => {
  return (
    <Wrapper>
      <Pie {...config} />
    </Wrapper>
  );
}

export default Chart;
