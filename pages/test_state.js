import useAppStore from "../src/store/global";

export default function Test() {
  const { isLoading, setIsLoading, handleOpenSnackBar, isCurrentUserExist } =
    useAppStore((state) => state);

  return (
    <>
      <div>
        <h1>is Loading? {isLoading.toString()}</h1>
        <button onClick={() => setIsLoading(!isLoading)}>Klik</button>
        <br />
        <button onClick={() => handleOpenSnackBar("Halo", "success")}>
          Open CustomSnackbar With Type
        </button>
        <br />
        <button onClick={() => handleOpenSnackBar("Halo")}>
          Open CustomSnackbar Without Type
        </button>
        <br />
        <h1>is CurrentUserEmpty? {isCurrentUserExist().toString()}</h1>
      </div>
    </>
  );
}
