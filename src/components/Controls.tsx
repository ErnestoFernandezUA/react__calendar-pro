import {
  FunctionComponent,
} from 'react';
import styled from 'styled-components';

import {
  selectCurrentDate,
  selectFormat,
  setFormat,
  setIntervalCalendar,
  setSpecialDate,
} from '../store/features/interval/intervalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ArrowNavigator } from './ArrowNavigator';
import { resetStateTodos } from '../store/features/todos/todosSlice';
import { FORMAT } from '../utils/constants/FORMAT';
import { POPUP } from '../utils/constants/POPUP';
import { Button } from './UI/Button';
import { FormParentControl } from './UI/Form/FormParentControl';
import { DatePicker } from './UI/DatePicker/DatePicker';
import {
  closeAllPopup,
  selectIsShowDatePicker,
  switchPopup,
} from '../store/features/controls/controlsSlice';
import { FormatValue } from '../types/format';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const FormatChanger = styled.div`
  display: flex;
  gap: 1em;
`;

const ControlsNavigate = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Controls: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(selectCurrentDate);
  const format = useAppSelector(selectFormat);
  const isShowDatePickerContainer = useAppSelector(selectIsShowDatePicker);

  const setIntervalHandler = (value: FormatValue) => {
    if (format === value) {
      return;
    }

    dispatch(setFormat(value));
    dispatch(setIntervalCalendar());
  };

  const onChangeDate = (day: number) => {
    dispatch(closeAllPopup());
    dispatch(setSpecialDate(new Date(day).valueOf()));
    dispatch(setFormat(FORMAT.MONTH));
    dispatch(setIntervalCalendar());
  };

  const onShowDatePickerHandler = () => {
    dispatch(switchPopup(POPUP.IS_SHOW_DATE_PICKER));
  };

  return (
    <Wrapper>
      <FormatChanger>
        <Button type="button" onClick={() => setIntervalHandler(FORMAT.YEAR)}>
          Year
        </Button>
        <Button type="button" onClick={() => setIntervalHandler(FORMAT.MONTH)}>
          Month
        </Button>
        <Button type="button" onClick={() => setIntervalHandler(FORMAT.WEEK)}>
          Week
        </Button>
        <Button type="button" onClick={() => setIntervalHandler(FORMAT.DAY)}>
          Day
        </Button>
      </FormatChanger>

      <FormParentControl />

      <Button type="button" onClick={() => dispatch(resetStateTodos())}>
        reset todos
      </Button>

      <ControlsNavigate>
        <ArrowNavigator />

        <DatePicker
          currentDate={currentDate}
          onChangeDate={onChangeDate}
          isShowDatePickerContainer={isShowDatePickerContainer}
          onShowDatePickerHandler={onShowDatePickerHandler}
        />
      </ControlsNavigate>
    </Wrapper>
  );
};
