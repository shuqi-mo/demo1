import { List, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

function Panel({ onUpdateValue }) {
  const stockItem = ["600893.SH", "002594.SZ"];
  const [selectedStock, setSelectedStock] = useState("600893.SH");
  const API_URL = "http://localhost:5000";

  const handleItemClick = (item) => {
    setSelectedStock(item);
    axios
    .post(`${API_URL}/update_single_stock_data`, { item })
    .then((response) => {
      onUpdateValue(response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <div>
      <div>
        <List
          header={<div>Stocklist</div>}
          dataSource={stockItem}
          renderItem={(item) => (
            <List.Item
              actions={[<Button type="link" onClick={() => handleItemClick(item)}>Select</Button>]}
              // onClick={() => handleItemClick(item)}
            >
              {item}
            </List.Item>
          )}
        />
        <Button type="primary" block>
          update
        </Button>
      </div>
    </div>
  );
}

export default Panel;
