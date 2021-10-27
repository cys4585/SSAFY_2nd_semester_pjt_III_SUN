import { useEffect } from "react"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import Header from "../components/Header"
import LabelInput from "../components/LabelInput"
import useInputs from "../hooks/useInputs"
import { emailValidator } from "../lib/validators"

const dummyData = {
  name: "김병훈",
  phone: "01032943270",
  email: "kepy1106@gmail.com",
}

const EditProfile = () => {
  const [state, handleChange] = useInputs({
    name: {
      value: "",
      errors: {},
      validators: [],
    },
    phone: {
      value: "",
      errors: {},
      validators: [],
    },
    email: {
      value: "",
      errors: {},
      validators: [emailValidator],
    },
  })
  const { name, phone, email } = state

  useEffect(() => {
    handleChange({ target: { name: "name", value: dummyData.name } })
    handleChange({ target: { name: "phone", value: dummyData.phone } })
    handleChange({ target: { name: "email", value: dummyData.email } })
  }, [])

  return (
    <>
      <Header pageTitle="마이페이지" to="/profile/kepy1106@gmail.com" />
      <main className="px-4 grid gap-2">
        <form className="grid gap-10">
          <div className="grid gap-4">
            <LabelInput
              label="이름"
              onChange={handleChange}
              name="name"
              errors={name.errors}
              value={name.value}
            />
            <LabelInput
              label="핸드폰 번호"
              onChange={handleChange}
              name="phone"
              errors={phone.errors}
              value={phone.value}
            />
            <LabelInput
              label="이메일"
              onChange={handleChange}
              name="email"
              errors={email.errors}
              value={email.value}
            />
          </div>
          <Button>확인</Button>
        </form>
        <Link
          to="/profile/change-password"
          className="text-sm font-medium text-gray-700 place-self-center"
        >
          비밀번호 수정
        </Link>
      </main>
    </>
  )
}

export default EditProfile