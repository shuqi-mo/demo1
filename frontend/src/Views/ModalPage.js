import { useState } from "react";
import Exampler from "./Exampler";
import { Button, Flex, Layout, message, Steps } from "antd";
import ConstructionPage from "./ConstructionPage";
import "../App.scss";
import EvaluationPage from "./EvaluationPage";

function ModalPage({ data }) {
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
      content: <ConstructionPage data={data}/>,
    },
    {
      title: "Evaluation",
      content: <EvaluationPage />,
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
          <Exampler data={data} />
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
            {current === steps.length - 1 && (
              <Button
                type="primary"
                onClick={() => message.success("Processing complete!")}
              >
                Done
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
