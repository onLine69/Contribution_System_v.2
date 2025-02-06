import "./Header.css";

function Header() {
  return (
    <header id="header">
      <div id="profile">
        <div id="profile-info">
          <p>
            <b>BUFFICOM OFFICER</b>
          </p>
          <p>CCS-EC</p>
        </div>
        <div>
          <img
            id="profile-picture"
            src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1735134285~exp=1735137885~hmac=2877ea17e034aa52a8b1d84e10e7ee5ab6c60e66f6c0a3933786fe1167f954e7&w=996"
            alt="Default Profile"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
