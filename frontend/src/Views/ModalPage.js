import { useState } from "react";
import Exampler from "./Exampler";
import { Button, Flex, Layout, Steps } from "antd";
import ConstructionPage from "./ConstructionPage";
import "../App.scss";
import EvaluationPage from "./EvaluationPage";

function ModalPage({ data, onUpdateParam, stock}) {
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Construction",
      content: <ConstructionPage data={data} onUpdateParam={onUpdateParam}/>,
    },
    {
      title: "Evaluation",
      content: <EvaluationPage data={data} stock={stock} onUpdateParam={onUpdateParam}/>,
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <div>
      <Flex>
        <Layout style={{background: "white"}}>
          <Exampler data={data[0]} />
        </Layout>
        <Layout style={{background: "white"}}>
          <Steps current={current} items={items} />
          <div>{steps[current].content}</div>
          <div
            style={{
              marginTop: 24,
            }}
          >
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current > 0 && (
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )}
          </div>
        </Layout>
      </Flex>
    </div>
  );
}

export default ModalPage;
