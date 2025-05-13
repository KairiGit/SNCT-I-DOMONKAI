# SNCT-I-DOMONKAI

```
$ npx create-next-app@latest
Need to install the following packages:
create-next-app@15.3.2
Ok to proceed? (y) y

√ What is your project named? ... my-app
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like your code inside a `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to use Turbopack for `next dev`? ... No / Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No / Yes
Creating a new Next.js app in C:\Users\Kairi\Documents\4i\DOMONKAI\SNCT-I-DOMONKAI\React\my-app.

Using npm.

Initializing project with template: app-tw


Installing dependencies:
- react
- react-dom
- next

Installing devDependencies:
- typescript
- @types/node
- @types/react
- @types/react-dom
- @tailwindcss/postcss
- tailwindcss
- eslint
- eslint-config-next
- @eslint/eslintrc


added 389 packages, and audited 390 packages in 2m

138 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

```
import tkinter as tk
from tkinter import ttk, messagebox
import random
import re

class StudentIDGenerator:
    def __init__(self, root):
        self.root = root
        self.root.title("学籍番号生成アプリケーション")
        self.root.geometry("600x400")  # 初期サイズをより小さく設定
        self.root.configure(bg="#f0f0f0")
        self.root.minsize(500, 250)  # 最小サイズをさらに小さく設定

        # ウィンドウサイズを自動調整するフラグ（常に有効）
        self.auto_resize = True

        # 各学年の最大人数を設定
        self.max_students = {
            1: 25,
            2: 30,
            3: 28,
            4: 20,
            5: 22
        }

        # 各学年の重み（デフォルト値は1.0）
        self.weights = {
            1: 1.0,
            2: 1.0,
            3: 1.0,
            4: 1.0,
            5: 1.0
        }

        # 各学年の当選人数カウンター
        self.selected_count = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }

        # 既に生成された学籍番号を保存するセット
        self.generated_ids = set()

        # 残りの学籍番号が何個あるかを学年ごとに追跡
        self.remaining_ids = {}
        for grade in range(1, 6):
            self.remaining_ids[grade] = list(f"{grade}I{num:02d}" for num in range(1, self.max_students[grade] + 1))

        # UIの構築
        self.setup_ui()

    def setup_ui(self):
        # フレームの設定
        main_frame = tk.Frame(self.root, bg="#f0f0f0")
        main_frame.pack(pady=10, padx=15, fill=tk.BOTH, expand=True)  # パディングを小さく

        # 学籍番号表示エリア
        id_frame = tk.Frame(main_frame, bg="#f0f0f0")  # LabelFrameからFrameに変更
        id_frame.pack(pady=10, fill=tk.X)  # パディングを小さく

        self.id_label = tk.Label(id_frame,font=("Helvetica", 60, "bold"), bg="#f0f0f0", fg="#333333")
        self.id_label.pack(pady=10)  # パディングを小さく

        # 学年ごとのカウント表示フレーム（折りたたみ可能）
        self.count_expanded = True

        count_header_frame = tk.Frame(main_frame, bg="#f0f0f0")
        count_header_frame.pack(pady=(10,0), fill=tk.X)  # パディングを小さく

        count_title_frame = tk.Frame(count_header_frame, bg="#f0f0f0")
        count_title_frame.pack(side=tk.LEFT, padx=5)  # パディングを小さく

        count_title = tk.Label(count_title_frame, text="学年ごとの当選人数", font=("Helvetica", 11, "bold"), bg="#f0f0f0")  # フォントサイズを小さく
        count_title.pack(side=tk.LEFT)

        self.count_toggle_btn = tk.Button(count_title_frame, text="▼", width=2, command=self.toggle_count_section)
        self.count_toggle_btn.pack(side=tk.LEFT, padx=3)  # パディングを小さく

        self.count_frame = tk.LabelFrame(main_frame, text="", font=("Helvetica", 11), bg="#f0f0f0", bd=1)  # フォントサイズを小さく
        self.count_frame.pack(pady=(0,10), fill=tk.X)  # パディングを小さく

        count_inner_frame = tk.Frame(self.count_frame, bg="#f0f0f0")
        count_inner_frame.pack(pady=5, padx=5)  # パディングを小さく

        # 学年ごとのカウント表示ラベルを作成
        self.count_labels = {}
        for grade in range(1, 6):
            grade_frame = tk.Frame(count_inner_frame, bg="#f0f0f0")
            grade_frame.grid(row=0, column=grade-1, padx=10)  # パディングを小さく

            grade_label = tk.Label(grade_frame, text=f"{grade}年", font=("Helvetica", 11), bg="#f0f0f0")  # フォントサイズを小さく
            grade_label.pack()

            self.count_labels[grade] = tk.Label(grade_frame, text="0", font=("Helvetica", 16, "bold"), bg="#f0f0f0")  # フォントサイズを小さく
            self.count_labels[grade].pack(pady=3)  # パディングを小さく

            # 各学年の残り人数も表示
            remaining_label = tk.Label(grade_frame, text=f"残り: {len(self.remaining_ids[grade])}", font=("Helvetica", 9), bg="#f0f0f0")  # フォントサイズを小さく
            remaining_label.pack()

        # 重み設定エリア（折りたたみ可能）
        self.weight_expanded = True

        weight_header_frame = tk.Frame(main_frame, bg="#f0f0f0")
        weight_header_frame.pack(pady=(10,0), fill=tk.X)  # パディングを小さく

        weight_title_frame = tk.Frame(weight_header_frame, bg="#f0f0f0")
        weight_title_frame.pack(side=tk.LEFT, padx=5)  # パディングを小さく

        weight_title = tk.Label(weight_title_frame, text="学年ごとの重み設定", font=("Helvetica", 11, "bold"), bg="#f0f0f0")  # フォントサイズを小さく
        weight_title.pack(side=tk.LEFT)

        self.weight_toggle_btn = tk.Button(weight_title_frame, text="▼", width=2, command=self.toggle_weight_section)
        self.weight_toggle_btn.pack(side=tk.LEFT, padx=3)  # パディングを小さく

        self.weight_frame = tk.LabelFrame(main_frame, text="", font=("Helvetica", 11), bg="#f0f0f0", bd=1)  # フォントサイズを小さく
        self.weight_frame.pack(pady=(0,10), fill=tk.X)  # パディングを小さく

        weight_inner_frame = tk.Frame(self.weight_frame, bg="#f0f0f0")
        weight_inner_frame.pack(pady=5, padx=5)  # パディングを小さく

        # 重み設定用のテキストボックスを作成
        self.weight_entries = {}
        for grade in range(1, 6):
            grade_label = tk.Label(weight_inner_frame, text=f"{grade}年:", font=("Helvetica", 11), bg="#f0f0f0")  # フォントサイズを小さく
            grade_label.grid(row=0, column=(grade-1)*2, padx=3, pady=3)  # パディングを小さく

            self.weight_entries[grade] = tk.Entry(weight_inner_frame, width=4, font=("Helvetica", 11))  # サイズとフォントを小さく
            self.weight_entries[grade].insert(0, "1.0")  # デフォルト値を設定
            self.weight_entries[grade].grid(row=0, column=(grade-1)*2+1, padx=3, pady=3)  # パディングを小さく

        # 重み更新ボタン
        update_button = tk.Button(self.weight_frame, text="重みを更新", font=("Helvetica", 11),
                                   command=self.update_weights, bg="#4CAF50", fg="white", pady=3)  # フォントサイズとパディングを小さく
        update_button.pack(pady=5)  # パディングを小さく

        # 学籍番号生成ボタン
        generate_button = tk.Button(main_frame, text="学籍番号を生成", font=("Helvetica", 12, "bold"),
                                     command=self.generate_student_id, bg="#2196F3", fg="white", pady=5, padx=15)  # サイズを小さく
        generate_button.pack(pady=10)  # パディングを小さく

        # リセットボタン
        reset_button = tk.Button(main_frame, text="リセット", font=("Helvetica", 11),
                                  command=self.reset_application, bg="#f44336", fg="white", pady=3)  # フォントサイズとパディングを小さく
        reset_button.pack(pady=5)  # パディングを小さく

    def update_weights(self):
        """重みの設定を更新する"""
        try:
            for grade in range(1, 6):
                # 入力値を取得して検証
                weight_str = self.weight_entries[grade].get()

                # 数値のバリデーション（正の数のみ許可）
                if not re.match(r'^[+]?([0-9]*[.])?[0-9]+$', weight_str):
                    messagebox.showerror("エラー", f"{grade}年の重みに無効な値が入力されています。正の数を入力してください。")
                    return

                weight = float(weight_str)
                if weight <= 0:
                    messagebox.showerror("エラー", f"{grade}年の重みは0より大きい値を入力してください。")
                    return

                self.weights[grade] = weight

            messagebox.showinfo("成功", "重みの設定を更新しました。")
        except ValueError:
            messagebox.showerror("エラー", "無効な値が入力されています。数値を入力してください。")

    def generate_student_id(self):
        """学籍番号をランダムに生成する"""
        # 全ての学年で学籍番号が生成済みかチェック
        available_grades = [grade for grade in range(1, 6) if len(self.remaining_ids[grade]) > 0]

        if not available_grades:
            messagebox.showinfo("情報", "すべての学籍番号が生成されました。リセットしてください。")
            return

        # 重み付きランダム選択のための準備
        valid_weights = [(grade, self.weights[grade]) for grade in available_grades]
        grades, weights = zip(*valid_weights)

        # 重み付きランダム選択で学年を選ぶ
        selected_grade = random.choices(grades, weights=weights, k=1)[0]

        # 選択された学年から未使用の学籍番号をランダムに選ぶ
        if self.remaining_ids[selected_grade]:
            # ランダムに学籍番号を選択
            student_id = random.choice(self.remaining_ids[selected_grade])

            # 使用済みリストから削除
            self.remaining_ids[selected_grade].remove(student_id)

            # 生成済みセットに追加
            self.generated_ids.add(student_id)

            # カウンターを更新
            self.selected_count[selected_grade] += 1

            # UI更新
            self.update_ui(student_id, selected_grade)
        else:
            # もし選択された学年の学籍番号が全て使われていたら再試行
            self.generate_student_id()

    def update_ui(self, student_id, selected_grade):
        """UI要素を更新する"""
        # 学籍番号ラベルを更新
        self.id_label.config(text=student_id)

        # 学年ごとのカウントラベルを更新
        for grade in range(1, 6):
            self.count_labels[grade].config(text=str(self.selected_count[grade]))

            # カウントラベルの親ウィジェットを取得して、残り人数ラベルを更新
            count_frame = self.count_labels[grade].master
            remaining_label = count_frame.winfo_children()[2]  # 3番目の子ウィジェットが残り人数ラベル
            remaining_label.config(text=f"残り: {len(self.remaining_ids[grade])}")

    def toggle_count_section(self):
        """学年ごとの当選人数セクションの折りたたみを切り替える"""
        if self.count_expanded:
            self.count_frame.pack_forget()
            self.count_toggle_btn.config(text="▶")
            self.count_expanded = False
        else:
            self.count_frame.pack(pady=(0,10), fill=tk.X, after=self.count_toggle_btn.master.master)
            self.count_toggle_btn.config(text="▼")
            self.count_expanded = True

        # 常にウィンドウサイズを調整
        self.adjust_window_size()

    def toggle_weight_section(self):
        """重み設定セクションの折りたたみを切り替える"""
        if self.weight_expanded:
            self.weight_frame.pack_forget()
            self.weight_toggle_btn.config(text="▶")
            self.weight_expanded = False
        else:
            self.weight_frame.pack(pady=(0,10), fill=tk.X, after=self.weight_toggle_btn.master.master)
            self.weight_toggle_btn.config(text="▼")
            self.weight_expanded = True

        # 常にウィンドウサイズを調整
        self.adjust_window_size()

    def adjust_window_size(self):
        """ウィンドウサイズを現在表示されているコンテンツに合わせて調整する"""
        # 最初にウィンドウを現在のコンテンツに合わせる
        self.root.update_idletasks()

        # 基本高さを設定（最小サイズ）
        base_height = 220  # 基本高さをさらに小さく設定

        # カウントセクションとウェイトセクションの高さを計算
        count_height = self.count_frame.winfo_height() if self.count_expanded else 0
        weight_height = self.weight_frame.winfo_height() if self.weight_expanded else 0

        # セクションのタイトルヘッダーの高さを加算
        header_height = 60  # ヘッダー高さを小さく設定

        # 合計の高さを計算
        total_height = base_height + count_height + weight_height + header_height

        # 現在のウィンドウの幅を取得
        current_width = self.root.winfo_width()

        # ウィンドウサイズを更新
        self.root.geometry(f"{current_width}x{total_height}")

    def toggle_auto_resize(self):
        """自動サイズ調整の有効/無効を切り替える"""
        self.auto_resize = self.auto_resize_var.get()

        # 有効にされたらすぐにサイズを調整
        if self.auto_resize:
            self.adjust_window_size()

    def reset_application(self):
        """アプリケーションをリセットする"""
        # 確認ダイアログ
        if messagebox.askyesno("確認", "本当にリセットしますか？すべての生成履歴が消去されます。"):
            # カウンターをリセット
            for grade in range(1, 6):
                self.selected_count[grade] = 0

            # 生成済み学籍番号をクリア
            self.generated_ids.clear()

            # 残りの学籍番号をリセット
            for grade in range(1, 6):
                self.remaining_ids[grade] = list(f"{grade}I{num:02d}" for num in range(1, self.max_students[grade] + 1))

            # UIをリセット
            self.id_label.config(text="まだ生成されていません")
            self.update_ui("", 0)  # ダミーの値で更新

if __name__ == "__main__":
    root = tk.Tk()
    app = StudentIDGenerator(root)

    # ウィンドウが最初に表示された後にサイズを調整
    root.update_idletasks()
    root.after(100, app.adjust_window_size)

    root.mainloop()
```
