import { useAtom } from "jotai";
import styled from "styled-components";
import {
  COLORS,
  extractActivatedSizeNumber,
  SIZES,
} from "../../../../lib/utility";
import { colorNoAtom, sizeNoAtom } from "../../../../store/newOrder";
import { PhItem } from "../../../../type";
import { RadioButton } from "../../../RadioButton";

export const SizeAndColor = ({ item }: { item: PhItem }) => {
  const [size, setSize] = useAtom(sizeNoAtom);
  const [color, setColor] = useAtom(colorNoAtom);
  const sizeSymbols = item.size?.size_table?.body
    ? item.size?.size_table?.body.map((row) => row[0])
    : [];
  const activatedSizeNumbers = extractActivatedSizeNumber(sizeSymbols);
  return (
    <Wrapper>
      <InputWrapper>
        <LabelWrapper>サイズ番:</LabelWrapper>
        <div className="flex flex-grow justify-center">
          <RadioButton
            state={size}
            setAction={setSize}
            members={SIZES}
            disables={SIZES.filter((s) => !activatedSizeNumbers.includes(s))}
          />
        </div>
      </InputWrapper>
      <InputWrapper>
        <LabelWrapper>色番:</LabelWrapper>
        <div className="flex flex-grow justify-center">
          <RadioButton state={color} setAction={setColor} members={COLORS} />
        </div>
      </InputWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LabelWrapper = styled.div`
  font-size: 1rem;
  width: 20%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
