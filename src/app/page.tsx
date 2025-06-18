"use client";
import React, { useState } from "react";
import { Users, Key, ArrowRight, Lock } from "lucide-react";
import { DiffieHellman, isPrime } from "./diffieHellman";
import Button from "./button";
import { User, UserCardProps } from "./types";
import "./styles.css";

const UserCard = ({
  user,
  isLeft,
  g,
  p,
}: Omit<UserCardProps, "showPrivateKeys" | "onTogglePrivateKeys">) => {
  return (
    <div className={`user-card ${isLeft ? "left" : "right"}`}>
      <div className="user-header">
        <Users className={`user-icon ${isLeft ? "left" : "right"}`} />
        <h3 className={`user-title ${isLeft ? "left" : "right"}`}>
          {user.name}
        </h3>
      </div>

      <div>
        <div className="section">
          <span className="section-label">Chave Privada:</span>
          <div className="section-value">{user.privateKey || "-"}</div>
        </div>

        <div className="section public">
          <span className="section-label">Chave Pública:</span>
          <div className="section-value public">{user.publicKey || "-"}</div>
          {user.publicKey && (
            <div className="formula">
              {g}^{user.privateKey} mod {p} = {user.publicKey}
            </div>
          )}
        </div>

        <div className="section received">
          <span className="section-label">Chave Pública Recebida:</span>
          <div className="section-value received">
            {user.receivedPublicKey || "-"}
          </div>
        </div>

        <div className="section shared">
          <span className="section-label">Segredo Compartilhado:</span>
          <div className="section-value shared">{user.sharedSecret || "-"}</div>
          {user.sharedSecret && user.receivedPublicKey && (
            <div className="formula">
              {user.receivedPublicKey}^{user.privateKey} mod {p} ={" "}
              {user.sharedSecret}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [p, setP] = useState<number>(23);
  const [g, setG] = useState<number>(5);
  const [showParameterConfig, setShowParameterConfig] =
    useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const [alice, setAlice] = useState<User>({
    name: "Alice",
    privateKey: null,
    publicKey: null,
    receivedPublicKey: null,
    sharedSecret: null,
    color: "blue",
  });

  const [bob, setBob] = useState<User>({
    name: "Bob",
    privateKey: null,
    publicKey: null,
    receivedPublicKey: null,
    sharedSecret: null,
    color: "green",
  });

  const generatePrivateKeys = (): void => {
    const alicePrivate = DiffieHellman.generatePrivateKey();
    const bobPrivate = DiffieHellman.generatePrivateKey();

    setAlice((prev) => ({ ...prev, privateKey: alicePrivate }));
    setBob((prev) => ({ ...prev, privateKey: bobPrivate }));
    setStep(1);
  };

  const calculatePublicKeys = (): void => {
    if (alice.privateKey && bob.privateKey) {
      const alicePublic = DiffieHellman.calculatePublicKey(
        g,
        alice.privateKey,
        p
      );
      const bobPublic = DiffieHellman.calculatePublicKey(g, bob.privateKey, p);

      setAlice((prev) => ({ ...prev, publicKey: alicePublic }));
      setBob((prev) => ({ ...prev, publicKey: bobPublic }));
      setStep(2);
    }
  };

  const exchangePublicKeys = (): void => {
    if (alice.publicKey && bob.publicKey) {
      setAlice((prev) => ({ ...prev, receivedPublicKey: bob.publicKey }));
      setBob((prev) => ({ ...prev, receivedPublicKey: alice.publicKey }));
      setStep(3);
    }
  };

  const calculateSharedSecrets = (): void => {
    if (
      alice.receivedPublicKey &&
      alice.privateKey &&
      bob.receivedPublicKey &&
      bob.privateKey
    ) {
      const aliceSecret = DiffieHellman.calculateSharedSecret(
        alice.receivedPublicKey,
        alice.privateKey,
        p
      );
      const bobSecret = DiffieHellman.calculateSharedSecret(
        bob.receivedPublicKey,
        bob.privateKey,
        p
      );

      setAlice((prev) => ({ ...prev, sharedSecret: aliceSecret }));
      setBob((prev) => ({ ...prev, sharedSecret: bobSecret }));
      setStep(4);
    }
  };

  const steps: string[] = [
    "Gerar chaves privadas",
    "Calcular chaves públicas",
    "Trocar chaves públicas",
    "Calcular segredo compartilhado",
  ];

  const getStepClass = (index: number): string => {
    if (index < step) return "completed";
    if (index === step) return "current";
    return "pending";
  };

  const resetDemo = (): void => {
    setAlice({
      name: "Alice",
      privateKey: null,
      publicKey: null,
      receivedPublicKey: null,
      sharedSecret: null,
      color: "blue",
    });
    setBob({
      name: "Bob",
      privateKey: null,
      publicKey: null,
      receivedPublicKey: null,
      sharedSecret: null,
      color: "green",
    });
    setStep(0);
  };

  return (
    <div className="container">
      <div className="main">
        <div className="header">
          <h1 className="title">Diffie-Hellman</h1>

          <div className="parameters-box">
            <div className="parameters-header">
              <h3 className="parameters-title">Parâmetros Públicos</h3>
              <button
                className="config-button"
                onClick={() => setShowParameterConfig(!showParameterConfig)}
              >
                {showParameterConfig ? "Ocultar" : "Configurar"}
              </button>
            </div>

            {showParameterConfig ? (
              <div className="parameters-config">
                <div className="parameters-grid">
                  <div className="input-group">
                    <label className="input-label">p (número primo)</label>
                    <input
                      type="number"
                      value={p}
                      onChange={(e) => setP(parseInt(e.target.value) || 23)}
                      className={`input-field ${!isPrime(p) ? "error" : ""}`}
                      disabled={step > 0}
                      min={2}
                      placeholder="23"
                    />
                    {!isPrime(p) && (
                      <p className="error-message">⚠️ {p} não é primo</p>
                    )}
                  </div>
                  <div className="input-group">
                    <label className="input-label">g (gerador)</label>
                    <input
                      type="number"
                      value={g}
                      onChange={(e) => setG(parseInt(e.target.value) || 5)}
                      className="input-field"
                      disabled={step > 0}
                      min={2}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="parameters-help">
                  p deve ser primo e g deve ser um gerador para o grupo
                  multiplicativo mod p
                </div>
              </div>
            ) : (
              <div className="parameters-display">
                <span className="parameter-item">
                  <strong>p (primo):</strong> {p}
                </span>
                <span className="parameter-item">
                  <strong>g (gerador):</strong> {g}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="progress-box">
          <div className="progress-header">
            <h3 className="progress-title">Progresso</h3>
            {step === 4 && (
              <button className="config-button" onClick={resetDemo}>
                Reiniciar Demo
              </button>
            )}
          </div>

          <div className="progress-steps">
            {steps.map((stepName, index) => (
              <div key={index}>
                <div
                  className={`step-item ${
                    index <= step ? "active" : "inactive"
                  }`}
                >
                  <div className={`step-circle ${getStepClass(index)}`}>
                    {index + 1}
                  </div>
                  <span className="step-text">{stepName}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight
                    className={`step-arrow ${
                      index < step ? "active" : "inactive"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid">
          <UserCard user={alice} isLeft={true} g={g} p={p} />
          <UserCard user={bob} isLeft={false} g={g} p={p} />
        </div>

        <div className="controls-box">
          <div className="controls-center">
            {step === 0 && (
              <Button onClick={generatePrivateKeys}>
                <Key
                  style={{ width: "16px", height: "16px", marginRight: "8px" }}
                />
                1. Gerar Chaves Privadas
              </Button>
            )}

            {step === 1 && (
              <Button onClick={calculatePublicKeys}>
                <Key
                  style={{ width: "16px", height: "16px", marginRight: "8px" }}
                />
                2. Calcular Chaves Públicas
              </Button>
            )}

            {step === 2 && (
              <Button onClick={exchangePublicKeys}>
                <ArrowRight
                  style={{ width: "16px", height: "16px", marginRight: "8px" }}
                />
                3. Trocar Chaves Públicas
              </Button>
            )}

            {step === 3 && (
              <Button onClick={calculateSharedSecrets}>
                <Lock
                  style={{ width: "16px", height: "16px", marginRight: "8px" }}
                />
                4. Calcular Segredo Compartilhado
              </Button>
            )}

            {step === 4 && (
              <div style={{ textAlign: "center" }}>
                <div className="success-box">
                  <strong>✅ Sucesso!</strong> Alice e Bob agora compartilham o
                  mesmo segredo: <strong>{alice.sharedSecret}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
