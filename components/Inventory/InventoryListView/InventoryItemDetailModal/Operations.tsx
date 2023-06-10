import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { privateApiCall } from "../../../../lib/utility";
import { InventoryOperation } from "../../../../type/invenope";
import { Operation } from "./Operation";

export const Operations = ({ itemCodeExt }: { itemCodeExt: string }) => {
  const [operations, setOperations] = useState<InventoryOperation[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await privateApiCall<InventoryOperation[]>(
        `/inventory/operations/${itemCodeExt}`,
        "GET"
      ).catch((err) => {
        console.log(err);
      });
      if (!res) return;
      setOperations(res);
    };
    loadData();
  }, [itemCodeExt]);

  if (!operations) return <Wrapper>loading</Wrapper>;
  return (
    <div className="flex-grow rounded-lg bg-subLight p-3 w-full">
      <ListWrapper>
        <div className="w-full sticky top-0 bg-sub flex flex-wrap justify-between px-2 z-1 rounded-md">
          <div>日付</div>
          <div>操作</div>
          <div className="flex gap-3">
            <span>jp</span>
            <span>cn</span>
            <span>pcn</span>
          </div>
        </div>
        {operations
          .filter((o) => o.operationType.type !== "move" || o.count >= 0)
          .map((o) => (
            <Operation key={o.id} operation={o} operations={operations} />
          ))}
      </ListWrapper>
    </div>
  );
};

const paddingTopBottom = 5;

const Wrapper = styled.div`
  height: 300px;
  width: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 8px;
  padding: ${paddingTopBottom}px 10px;
  background-color: #a2b7a066;
`;

const ListWrapper = styled.div`
  width: 100%;
  height: calc(270px - ${paddingTopBottom * 2}px);
  padding: 0 0.25rem;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  border-radius: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  transition: 0.5s;
`;
