export default function STM32SetupBlog() {
  return (
    <>
      <article className="articleContainer mt-20 md:ml-[300px] md:w-[700px]">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold mb-2">
              STM32 Setup — Step-by-step 
            </h1>
            <p className="text-gray-100">
              This guide is for beginners: covering hardware, toolchain, CubeMX/IDE,
              example code, and debugging tips.
            </p>
          </header>

          {/* 1. What is STM32 */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>1. What is STM32?</h2>
            <p>
              STM32 is an ARM Cortex-M based microcontroller family by
              STMicroelectronics. It offers a wide range of cores (M0/M0+/M3/M4/M7/M33)
              and peripherals — GPIO, UART, I²C, SPI, ADC, timers, DMA, USB, CAN, etc.
            </p>
          </section>

          {/* 2. Required Hardware */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>2. Required Hardware</h2>
            <ul>
              <li>
                STM32 development board (e.g., Nucleo / Discovery / Blue Pill / custom board)
              </li>
              <li>
                ST-Link/V2 or onboard ST-Link debugger (Nucleo/Discovery boards have it built-in)
              </li>
              <li>USB cable, breadboard, jumper wires, LED + resistor</li>
            </ul>
          </section>

          {/* 3. Required Software */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>3. Required Software</h2>
            <ol>
              <li>
                <strong>STM32CubeIDE</strong> — ST's official IDE that integrates CubeMX
                configuration tool. (Recommended for beginners)
              </li>
              <li>
                <strong>STM32CubeMX</strong> — Pinout/clock generator (standalone CubeMX is useful if
                using CLI/VSCode)
              </li>
              <li>
                <strong>GNU Arm Embedded Toolchain</strong> (arm-none-eabi-gcc) — compiler
              </li>
              <li>
                <strong>OpenOCD / ST-Link Utility</strong> — flashing/debugging (for custom setups)
              </li>
              <li>
                <strong>VS Code + PlatformIO</strong> — if you prefer a lightweight editor
              </li>
            </ol>
          </section>

          {/* 4. Project Steps */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>4. Basic Steps to Create a Project (CubeMX / CubeIDE)</h2>
            <ol>
              <li>
                <strong>Select Board/MCU:</strong> Choose a Nucleo board or
                enter MCU part number (e.g., STM32F103C8).
              </li>
              <li>
                <strong>Configure Pinout:</strong> Map on-chip peripherals to pins —
                e.g., PA5 as GPIO output for LED.
              </li>
              <li>
                <strong>Configure Clock:</strong> Set system clock
                (HSE/HSI/LSE) and adjust PLL settings.
              </li>
              <li>
                <strong>Middleware/Peripherals:</strong> Enable UART, I²C, SPI, ADC, etc.,
                and set parameters (baud rate, mode, prescalers).
              </li>
              <li>
                <strong>Project Settings & Code Generation:</strong> Choose toolchain
                (STM32CubeIDE, Makefile, SW4STM32) and click "Generate Code".
              </li>
              <li>
                <strong>Build & Flash:</strong> Click build, then use ST-Link to flash & debug.
              </li>
            </ol>
          </section>

          {/* 5. Blink Example */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>5. Simple Blink Example (HAL)</h2>
            <p>
              In a CubeMX-generated project, your <code>main.c</code> may contain code like this —
              toggling PA5 pin:
            </p>
            <pre className="rounded-md p-4 bg-gray-800 overflow-auto">
{`/* USER CODE BEGIN 2 */
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);
/* USER CODE END 2 */

while (1)
{
  HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
  HAL_Delay(500); // 500 ms
}`}
            </pre>
            <p>
              This uses HAL API: <code>HAL_GPIO_TogglePin</code> and{" "}
              <code>HAL_Delay</code>. CubeMX generates the GPIO initialization
              boilerplate for you.
            </p>
          </section>

          {/* 6. HAL vs LL vs Bare-Metal */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>6. HAL vs LL vs Bare-Metal</h2>
            <ul>
              <li>
                <strong>HAL:</strong> High-level, portable, easy to use — best for beginners.
              </li>
              <li>
                <strong>LL (Low Layer):</strong> Lightweight, faster,
                hardware-close — good for optimization.
              </li>
              <li>
                <strong>Bare-metal / Register:</strong> Full control, but error-prone and time-consuming.
              </li>
            </ul>
          </section>

          {/* 7. VS Code / PlatformIO */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>7. VS Code / PlatformIO Workflow</h2>
            <p>
              Using PlatformIO in VS Code allows rapid project management.
              If generating code from CubeMX, make sure to check Makefile/CMake integration —
              PlatformIO supports multiple boards & frameworks.
            </p>
          </section>

          {/* 8. Debugging */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>8. Debugging Tips</h2>
            <ul>
              <li>
                Check ST-Link connection (drivers must be installed)
              </li>
              <li>
                Verify reset/BOOT0 pin state if flashing fails
              </li>
              <li>
                Use SWD pins (PA13/PA14 on many MCUs) for debugging
              </li>
              <li>Read OpenOCD logs to understand error causes</li>
            </ul>
          </section>

          {/* 9. Troubleshooting */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>9. Common Troubleshooting</h2>
            <ol>
              <li>
                "No target device found" — check power, USB cable, drivers,
                board jumpers
              </li>
              <li>
                Wrong clock configuration — if MCU hangs, verify HSE/PLL settings
              </li>
              <li>
                Compilation errors after code generation —
                could be a toolchain/version mismatch
              </li>
            </ol>
          </section>

          {/* 10. Resources */}
          <section className="mb-3 p-4 rounded-lg border border-gray-300 shadow-sm">
            <h2>10. Useful Resources</h2>
            <ul>
              <li>ST official: STM32CubeIDE & STM32CubeMX documentation</li>
              <li>STM32 step-by-step wiki & community forums</li>
              <li>STM32 example projects & HAL/LL user manuals</li>
            </ul>
          </section>
        </div>
      </article>
    </>
  );
}
