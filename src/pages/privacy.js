import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './publisher.module.css';

export default function PrivacyPage() {
  return (
    <Layout
      title="隐私政策"
      description="代码酷关于 Cookie、可选的学习账户、Google AdSense、统计服务、第三方广告和用户选择的隐私说明。">
      <main className={styles.page}>
        <div className="container">
          <article className={styles.article}>
            <p className={styles.eyebrow}>Privacy Policy</p>
            <Heading as="h1">隐私政策</Heading>
            <p className={styles.lead}>
              本页面说明代码酷在访问统计、广告展示和站点运行中可能涉及的数据处理方式。最后更新：2026 年 10 月 22 日。
            </p>

            <Heading as="h2">我们可能收集的信息</Heading>
            <p>
              当你访问代码酷时，浏览器、服务器、统计服务或广告服务可能记录常见的技术信息，例如访问页面、访问时间、设备与浏览器类型、来源页面、IP 地址、Cookie 或类似标识符。这些信息用于站点统计、问题排查、内容改进和广告展示。
            </p>

            <Heading as="h2">可选的学习账户</Heading>
            <p>
              不注册账户也可以阅读全部教程，并使用保存在浏览器中的学习工具。已读标记、书签、笔记和练习记录保存在你的浏览器中；你下载的备份文件只保存在你自己的设备上。
            </p>
            <p>
              如果你选择使用 Google 登录，或者把 Google 账户关联到代码酷账户，我们会收到你的 Google 账户标识符、姓名和邮箱地址（以及 Google 提供的邮箱验证状态）。Google 登录使用 Google Identity Services：对于已在浏览器中登录 Google 的访客，Google 可能会在大多数页面上显示一个小的“使用 Google 账号登录”提示（One Tap）；如果你以前在本站用过 Google 登录，并且浏览器中只有一个 Google 会话，Google 可能会在你之后访问时自动为你登录。退出登录会关闭自动登录。关闭提示后，它至少两周内不会再出现。Google 会为这些提示设置自己的 Cookie，并按照 Google 的隐私政策处理。
            </p>
            <p>
              如果你选择使用 GitHub 登录，或者关联 GitHub 账户，我们会收到你的 GitHub 账户标识符、用户名、姓名和主要的已验证邮箱地址。GitHub 按照它自己的隐私政策处理登录过程。我们不会收到你的 Google 或 GitHub 密码。
            </p>
            <p>
              我们用账户标识符识别对应的登录方式，并把姓名和邮箱与你的账户一起保存，以便识别你的账户并就账户事宜与你联系；这些邮箱不会被用来直接登录。每次通过 Google 或 GitHub 登录时，这些信息都会更新；取消关联该登录方式或删除账户后，这些信息会被删除。你可以在<a href="/profile/">个人资料</a>页面管理显示名称和已关联的登录方式。
            </p>
            <p>
              为了让你保持登录状态，本站使用一个必要的会话 Cookie（__Host-cnr_session，HttpOnly，有效期最长 30 天），页面脚本无法读取它。同时还会设置一个页面可以读取的提示 Cookie（cnr_signed_in=1），它只表示“这个浏览器已登录”，不包含任何账户信息，用来让页面在打开时决定是否需要向服务器确认登录状态。退出登录时，这两个 Cookie 都会被清除。
            </p>
            <p>
              登录期间，你的学习记录（包括阅读进度、书签、保存的笔记和练习记录）会自动保存到我们在 Cloudflare D1 中的数据库，并在你的设备之间同步。访客学习记录保存在浏览器中独立的位置，不会自动并入已登录的账户。我们只用账户中的学习数据来恢复你的进度，方便你在不同设备上继续学习。
            </p>
            <p>
              退出登录会结束当前会话，并恢复访客学习记录；访客和账户的学习缓存都会留在该浏览器中。在共用设备上，请在保存需要的备份后清除本站的浏览器数据。你可以在<a href="/profile/">个人资料</a>页面删除账户及其保存的学习记录，这也会结束该账户的所有登录会话。Cloudflare 数据库的恢复副本可能会在其设定的恢复期内保留已删除的数据。浏览器中的本地记录和你以前下载的备份是独立的副本，需要你自行删除。
            </p>

            <Heading as="h2">Google 广告 Cookie</Heading>
            <p>
              第三方供应商（包括 Google）会使用 Cookie 根据用户此前访问代码酷或其他网站的情况投放广告。Google 使用广告 Cookie 后，Google 及其合作伙伴可以根据用户访问本站或互联网上其他网站的情况展示广告。
            </p>
            <p>
              你可以访问 <a href="https://www.google.com/settings/ads">Google 广告设置</a> 选择退出个性化广告。你也可以访问 <a href="https://www.aboutads.info">aboutads.info</a> 了解部分第三方供应商的个性化广告退出方式。
            </p>

            <Heading as="h2">第三方服务</Heading>
            <p>
              本站可能使用 Google AdSense、Google Analytics、Baidu Analytics、搜索服务和托管相关服务。这些服务可能通过 Cookie、网络信标、IP 地址或其他标识符收集和处理信息。你可以阅读 Google 的说明了解
              {' '}<a href="https://policies.google.com/technologies/partner-sites">Google 如何使用合作伙伴网站或应用中的数据</a>。
            </p>

            <Heading as="h2">我们如何使用信息</Heading>
            <ul>
              <li>了解哪些教程更常被访问，从而安排内容维护。</li>
              <li>排查页面加载、搜索、链接或兼容性问题。</li>
              <li>展示、衡量和改进广告服务。</li>
              <li>防止滥用、垃圾请求或影响站点稳定性的访问行为。</li>
            </ul>

            <Heading as="h2">你的选择</Heading>
            <p>
              你可以在浏览器中删除或限制 Cookie，也可以使用浏览器隐私设置、广告偏好设置或第三方退出工具管理个性化广告。限制 Cookie 后，部分功能、统计或广告展示可能无法按预期工作。
            </p>

            <Heading as="h2">联系我们</Heading>
            <p>
              如果你对本隐私政策有疑问，请发送邮件到 <a href="mailto:feedback@echo.cool">feedback@echo.cool</a>。
            </p>
          </article>
        </div>
      </main>
    </Layout>
  );
}
