import {
  ChangeEvent,
  // ChangeEvent,
  FunctionComponent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import {
  IoTimeOutline,
} from 'react-icons/io5';

import { COLOR } from '../../../utils/constants/COLOR';
import { FORM_DATA } from '../../../utils/constants/FORM_DATA';
import { handleClickOutside } from '../../../helpers/handleClickOutside';
import {
  resetTodo,
  selectTodoToForm,
  switchPopup,
} from '../../../store/features/controls/controlsSlice';
import {
  selectCurrentDate,
} from '../../../store/features/interval/intervalSlice';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../store/hooks';
// import { ColorKeys } from '../../../type/Color';
// import { FormDataType } from '../../../type/Form';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker/DatePicker';
import { TimePicker } from '../TimePicker/TimePicker';
import { FormDataType } from '../../../types/form';
import { ColorKeys } from '../../../types/color';
import { POPUP } from '../../../utils/constants/POPUP';
import { saveTodo } from '../../../store/features/todos/todosSlice';
// import { POPUP } from '../../constants/POPUP';
// import { changeTodo } from '../../store/features/Todo/todoSlice';

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: var(--background-color);
  padding: 2em;
  box-sizing: border-box;
  border-radius: 0.3em;
  box-shadow: var(--box-shadow-color) 0px 3px 8px;
  text-align: center;

  & h3 {
    margin-bottom: 20px;
  }
`;

const FormContainer = styled.form`
  `;

const FormItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: left;
  align-items: center;

  & label {
    width: 10em;
    text-align: right;
    padding-right: 10px;
    box-sizing: border-box;
  }

  & input {
    width: 10em;

    &:focus, &:active {
      /* border: 1px solid red; */
    }
  }
`;

const initialValueForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  color: '',
};

interface FormProps {
  buttonRef: RefObject<HTMLButtonElement | HTMLDivElement>;
  onShowFormHandler: () => void;
}

export const Form: FunctionComponent<FormProps>
= ({
  buttonRef,
  onShowFormHandler,
}) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<FormDataType>(initialValueForm);
  const [
    isShowDatePickerContainer,
    setIsShowDatePickerContainer,
  ] = useState<boolean>(false);

  const formRef = useRef<HTMLDivElement>(null);
  const currentDate = useAppSelector(selectCurrentDate);
  const [isShowTimePicker, setIsShowTimePicker]
  = useState<boolean>(false);
  const todo = useAppSelector(selectTodoToForm);

  // eslint-disable-next-line no-console
  console.log('Form todo', todo);

  useEffect(() => {
    document.addEventListener('click', (event) => handleClickOutside(
      event, buttonRef, formRef, onShowFormHandler,
    ));

    return () => {
      document.removeEventListener('click', (event) => handleClickOutside(
        event, buttonRef, formRef, onShowFormHandler,
      ));
    };
  }, []);

  useEffect(() => {
    if (todo) {
      setValue({
        title: todo.title,
        description: todo.description,
        date: (todo.date).toString(),
        time: (todo.date).toString(),
        color: todo.color,
      });
    } else {
      setValue({
        ...value,
        date: currentDate.toString(),
      });
    }

    return () => {
      setValue(initialValueForm);
      dispatch(resetTodo());
    };
  }, []);

  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setValue((prevValue) => ({
      ...prevValue,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Form onSubmit', value);

    const prepareDate = new Date(
      new Date(+value[FORM_DATA.DATE]).getFullYear(),
      new Date(+value[FORM_DATA.DATE]).getMonth(),
      new Date(+value[FORM_DATA.DATE]).getDate(),
      new Date(+value[FORM_DATA.TIME]).getHours(),
      new Date(+value[FORM_DATA.TIME]).getMinutes(),
    ).valueOf();

    const newTodo = {
      title: value[FORM_DATA.TITLE],
      description: value[FORM_DATA.DESCRIPTION],
      date: prepareDate,
      color: value[FORM_DATA.COLOR],
      todoId: `${new Date().valueOf()}`,
    };

    dispatch(saveTodo(newTodo));
    dispatch(switchPopup(POPUP.IS_SHOW_FORM));
  };

  const onChangeDate = useCallback((newDate: number) => {
    // eslint-disable-next-line no-console
    // console.log('onChangeDate');

    setValue((prevValue: FormDataType) => ({
      ...prevValue,
      [FORM_DATA.DATE]: String(newDate),
    }));

    setIsShowDatePickerContainer(false);
  }, []);

  const onChangeTime = useCallback((newTime: number) => {
    // eslint-disable-next-line no-console
    console.log('onChangeTime',
      new Date(newTime).toDateString(),
      new Date(newTime).toTimeString());

    setValue((prevValue: FormDataType) => ({
      ...prevValue,
      [FORM_DATA.TIME]: String(newTime),
    }));
  }, []);

  const onShowDatePickerHandler = () => {
    setIsShowDatePickerContainer((prev) => !prev);
  };

  const onShowTimePickerHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    setIsShowTimePicker(show => !show);
    onChangeTime(new Date().valueOf());
  };

  const dateValue = new Date(+value[FORM_DATA.DATE as keyof FormDataType]
    || currentDate).toDateString();

  // const timeValue = value[FORM_DATA.TIME as keyof FormDataType]
  //   ? new Date(+value[FORM_DATA.TIME as keyof FormDataType]
  //     || currentDate).toTimeString().split(' ')[0]
  //   : 'no time';

  // eslint-disable-next-line no-console
  console.log('render Form');

  return (
    <Wrapper ref={formRef}>
      <h3>{todo ? `Edit ${todo.title}` : 'Create new'}</h3>

      <FormContainer onSubmit={handleSubmit}>
        <FormItem key={FORM_DATA.TITLE}>
          <label htmlFor={FORM_DATA.TITLE}>
            {FORM_DATA.TITLE}
            :&nbsp;
          </label>
          <input
            id={FORM_DATA.TITLE}
            type="text"
            name={FORM_DATA.TITLE}
            value={value[FORM_DATA.TITLE as keyof FormDataType]}
            onChange={handleChange}
            placeholder={`input ${FORM_DATA.TITLE}`}
            required
          />
        </FormItem>

        <FormItem key={FORM_DATA.DESCRIPTION}>
          <label htmlFor={FORM_DATA.DESCRIPTION}>
            {FORM_DATA.DESCRIPTION}
            :&nbsp;
          </label>
          <input
            id={FORM_DATA.DESCRIPTION}
            type="text"
            name={FORM_DATA.DESCRIPTION}
            value={value[FORM_DATA.DESCRIPTION as keyof FormDataType]}
            onChange={handleChange}
            placeholder={`input ${FORM_DATA.DESCRIPTION}`}
            required
          />
        </FormItem>

        <FormItem key={FORM_DATA.DATE}>
          <label htmlFor={FORM_DATA.DATE}>
            {FORM_DATA.DATE}
            :&nbsp;
          </label>
          {dateValue}
          <DatePicker
            currentDate={currentDate}
            onChangeDate={onChangeDate}
            isShowDatePickerContainer={isShowDatePickerContainer}
            onShowDatePickerHandler={onShowDatePickerHandler}
          />
        </FormItem>

        <FormItem key={FORM_DATA.TIME}>
          <label htmlFor={FORM_DATA.TIME}>
            {FORM_DATA.TIME}
            :&nbsp;
          </label>
          {/* {timeValue} */}

          {isShowTimePicker ? (
            <TimePicker
              time={+value[FORM_DATA.TIME as keyof FormDataType]}
              onChangeTime={onChangeTime}
            />
          ) : (
            <Button
              type="button"
              onClick={e => onShowTimePickerHandler(e)}
            >
              <IoTimeOutline size={30} />
            </Button>
          )}
        </FormItem>

        <FormItem key={FORM_DATA.COLOR}>
          <label htmlFor={FORM_DATA.COLOR}>
            {FORM_DATA.COLOR}
            :&nbsp;
          </label>

          <select
            name={FORM_DATA.COLOR}
            id={FORM_DATA.COLOR}
            value={value[FORM_DATA.COLOR as keyof FormDataType]}
            onChange={handleChange}
          >
            <option
              value="default"
              defaultValue="default"
              disabled
            >
              Chose color
            </option>
            {Object.keys(COLOR).map((item) => (
              <option
                key={COLOR[item as ColorKeys].value}
                value={COLOR[item as ColorKeys].value}
              >
                {COLOR[item as ColorKeys].label}
              </option>
            ))}
          </select>
        </FormItem>

        <Button type="submit">{`${todo ? 'Change' : 'Add'} Todo`}</Button>
      </FormContainer>
    </Wrapper>
  );
};
